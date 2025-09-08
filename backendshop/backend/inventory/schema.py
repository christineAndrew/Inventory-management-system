# File: inventory/schema.py
import graphene
from graphene_django import DjangoObjectType
from django.db.models import Sum, Q, F, Count
from django.utils import timezone
from datetime import timedelta, datetime
from decimal import Decimal
from .models import Product, Sale, SaleItem
import random
import string

class SaleType(DjangoObjectType):
    class Meta:
        model = Sale
        fields = "__all__"

         # Ensure numeric fields are properly typed
    total_amount = graphene.Decimal()
    tax_amount = graphene.Decimal()
    discount_amount = graphene.Decimal()
    final_amount = graphene.Decimal()


    items = graphene.List(lambda: SaleItemType)



    def resolve_items(self, info):
        return self.items.all()

class SaleItemType(DjangoObjectType):
    class Meta:
        model = SaleItem
        fields = "__all__"

    unit_price = graphene.Decimal()
    total_price = graphene.Decimal()
    profit = graphene.Decimal()
    product_name = graphene.String()

    def resolve_product_name(self, info):
        return self.product.name
    
class SaleItemInput(graphene.InputObjectType):
    product_id = graphene.Int(required=True)
    quantity = graphene.Int(required=True)
    unit_price = graphene.Decimal(required=True)

class SaleInput(graphene.InputObjectType):
    customer_name = graphene.String()
    customer_email = graphene.String()
    customer_phone = graphene.String()
    items = graphene.List(SaleItemInput, required=True)
    tax_amount = graphene.Decimal(default_value=0)
    discount_amount = graphene.Decimal(default_value=0)
    payment_method = graphene.String(default_value="CASH")
    notes = graphene.String()

class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = "__all__"

class ProductInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    description = graphene.String()
    category = graphene.String(required=True)
    cost_price = graphene.Decimal(required=True)
    selling_price = graphene.Decimal(required=True)

class CreateProduct(graphene.Mutation):
    class Arguments:
        input = ProductInput(required=True)

    product = graphene.Field(ProductType)

    def mutate(self, info, input):
        product = Product(
            name=input.name,
            description=input.description,
            category=input.category,
            cost_price=input.cost_price,
            selling_price=input.selling_price
        )
        product.save()
        return CreateProduct(product=product)

class UpdateProduct(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        input = ProductInput(required=True)

    product = graphene.Field(ProductType)

    def mutate(self, info, id, input):
        id = int(id)
        product = Product.objects.get(pk=id)
        product.name = input.name
        product.description = input.description
        product.category = input.category
        product.cost_price = input.cost_price
        product.selling_price = input.selling_price
        product.save()
        return UpdateProduct(product=product)

class DeleteProduct(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id):
        product = Product.objects.get(pk=id)
        product.delete()
        return DeleteProduct(success=True)

class CreateSale(graphene.Mutation):
    class Arguments:
        input = SaleInput(required=True)

    sale = graphene.Field(SaleType)

    def mutate(self, info, input):
        # Generate a unique sale number
        sale_number = 'S' + ''.join(random.choices(string.digits, k=6))
        while Sale.objects.filter(sale_number=sale_number).exists():
            sale_number = 'S' + ''.join(random.choices(string.digits, k=6))
        
        # Calculate total amount
        total_amount = Decimal('0')
        final_amount = Decimal('0')
        sale_items_data = []
        
        for item in input.items:
            product = Product.objects.get(id=item.product_id)
            item_total = item.unit_price * item.quantity
            total_amount += item_total
            
            sale_items_data.append({
                'product': product,
                'quantity': item.quantity,
                'unit_price': item.unit_price,
                'cost_price': product.cost_price,
                'total_price': item_total,
                'profit': (item.unit_price - product.cost_price) * item.quantity
            })
        
        # Calculate final amount
        tax_amount = input.tax_amount or Decimal('0')
        discount_amount = input.discount_amount or Decimal('0')
        final_amount = total_amount + tax_amount - discount_amount
        
        # Create sale
        sale = Sale.objects.create(
            sale_number=sale_number,
            customer_name=input.customer_name or '',
            customer_email=input.customer_email or '',
            customer_phone=input.customer_phone or '',
            total_amount=total_amount,
            tax_amount=tax_amount,
            discount_amount=discount_amount,
            final_amount=final_amount,
            status='COMPLETED',
            payment_method=input.payment_method,
            notes=input.notes or '',
            created_by=info.context.user if info.context.user.is_authenticated else None
        )
        
        # Create sale items
        for item_data in sale_items_data:
            SaleItem.objects.create(sale=sale, **item_data)
        
        return CreateSale(sale=sale)

class ProfitLossType(graphene.ObjectType):
    date = graphene.String()
    profit = graphene.Decimal()
    loss = graphene.Decimal()
    revenue = graphene.Decimal()
    cost = graphene.Decimal()

class ProfitLossAnalytics(graphene.ObjectType):
    daily = graphene.List(ProfitLossType)
    weekly = graphene.List(ProfitLossType)
    total_profit = graphene.Decimal()
    total_loss = graphene.Decimal()
    total_revenue = graphene.Decimal()

class Mutation(graphene.ObjectType):
    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    delete_product = DeleteProduct.Field()
    create_sale = CreateSale.Field()

class DashboardDataType(graphene.ObjectType):
    daily_profit = graphene.Decimal()
    weekly_profit = graphene.Decimal()
    daily_loss = graphene.Decimal()
    weekly_loss = graphene.Decimal()
    total_products = graphene.Int()
    products_sold_today = graphene.Int()

class LowStockItemType(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    current_stock = graphene.Int()
    min_stock = graphene.Int()

# In your Django schema, ensure amount is returned as float/decimal
class RecentSaleType(graphene.ObjectType):
    id = graphene.Int()
    product_name = graphene.String()
    quantity = graphene.Int()
    amount = graphene.Decimal()  # Use Decimal instead of String
    sale_date = graphene.DateTime()
class ProfitLossDataType(graphene.ObjectType):
    date = graphene.String()
    profit = graphene.Decimal()
    loss = graphene.Decimal()

class Query(graphene.ObjectType):
    dashboard_data = graphene.Field(DashboardDataType)
    low_stock_items = graphene.List(LowStockItemType)
    recent_sales = graphene.List(RecentSaleType)
    profit_loss_data = graphene.List(ProfitLossDataType)
    
    products = graphene.List(ProductType, search=graphene.String())
    product = graphene.Field(ProductType, id=graphene.Int())
    sales = graphene.List(
        SaleType,
        start_date=graphene.DateTime(required=False),
        end_date=graphene.DateTime(required=False),
        limit=graphene.Int(required=False)
    )

    def resolve_products(self, info, search=None, **kwargs):
        if search:
            filter = (
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(category__icontains=search)
            )
            return Product.objects.filter(filter)
        return Product.objects.all()

    def resolve_product(self, info, id):
        return Product.objects.get(pk=id)

    def resolve_sales(self, info, start_date=None, end_date=None, limit=None):
        qs = Sale.objects.all()

        if start_date:
            qs = qs.filter(created_at__gte=start_date)
        if end_date:
            qs = qs.filter(created_at__lte=end_date)
        if limit:
            qs = qs[:limit]

        return qs

    def resolve_dashboard_data(self, info):
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        # Calculate daily profit (today's sales profit)
        daily_sales = Sale.objects.filter(created_at__date=today)
        daily_profit = daily_sales.aggregate(
            total_profit=Sum('final_amount')
        )['total_profit'] or Decimal('0.00')
        
        # Calculate weekly profit (last 7 days sales profit)
        weekly_sales = Sale.objects.filter(created_at__date__gte=week_ago)
        weekly_profit = weekly_sales.aggregate(
            total_profit=Sum('final_amount')
        )['total_profit'] or Decimal('0.00')
        
        # For this example, we'll calculate loss as products that were sold below cost
        # You might have a different way to track losses
        daily_loss = Decimal('0.00')
        weekly_loss = Decimal('0.00')
        
        total_products = Product.objects.count()
        products_sold_today = daily_sales.aggregate(total_sold=Sum('items__quantity'))['total_sold'] or 0
        
        return DashboardDataType(
            daily_profit=daily_profit,
            weekly_profit=weekly_profit,
            daily_loss=daily_loss,
            weekly_loss=weekly_loss,
            total_products=total_products,
            products_sold_today=products_sold_today
        )
    
    def resolve_low_stock_items(self, info):
        # Get products with low stock (assuming we have a stock field)
        # For now, we'll return empty list as we don't have stock model
        return []
    
    def resolve_recent_sales(self, info):
        recent_sales = Sale.objects.prefetch_related('items__product').order_by('-created_at')[:5]
        return [
            RecentSaleType(
                id=sale.id,
                product_name=', '.join([item.product.name for item in sale.items.all()]),
                quantity=sum([item.quantity for item in sale.items.all()]),
                amount=sale.final_amount,
                sale_date=sale.created_at
            )
            for sale in recent_sales
        ]
    
    def resolve_profit_loss_data(self, info):
        # Generate profit/loss data for the last 7 days
        profit_loss_data = []
        today = timezone.now().date()
        
        for i in range(6, -1, -1):  # Last 7 days including today
            date = today - timedelta(days=i)
            day_sales = Sale.objects.filter(created_at__date=date)
            
            profit = day_sales.aggregate(
                total_profit=Sum('final_amount')
            )['total_profit'] or Decimal('0.00')
            
            # Calculate loss for products sold below cost
            loss = Decimal('0.00')
            
            profit_loss_data.append(
                ProfitLossDataType(
                    date=date.strftime('%Y-%m-%d'),
                    profit=profit,
                    loss=loss
                )
            )
        
        return profit_loss_data
    
    def resolve_profit_loss_analytics(self, info, days=30):
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        # Get all completed sales in the period
        sales = Sale.objects.filter(
            created_at__date__range=[start_date, end_date],
            status='COMPLETED'
        )
        
        # Calculate daily profit/loss
        daily_data = []
        current_date = start_date
        
        while current_date <= end_date:
            daily_sales = sales.filter(created_at__date=current_date)
            daily_revenue = daily_sales.aggregate(total=Sum('final_amount'))['total'] or Decimal('0')
            
            # Calculate profit and loss
            daily_items = SaleItem.objects.filter(sale__in=daily_sales)
            daily_profit = daily_items.aggregate(profit=Sum('profit'))['profit'] or Decimal('0')
            
            # For loss calculation, we'll consider products sold below cost
            daily_loss = daily_items.filter(unit_price__lt=F('cost_price')).aggregate(
                loss=Sum((F('cost_price') - F('unit_price')) * F('quantity'))
            )['loss'] or Decimal('0')
            
            daily_cost = daily_items.aggregate(cost=Sum(F('cost_price') * F('quantity')))['cost'] or Decimal('0')
            
            daily_data.append(ProfitLossType(
                date=current_date.isoformat(),
                profit=daily_profit,
                loss=daily_loss,
                revenue=daily_revenue,
                cost=daily_cost
            ))
            
            current_date += timedelta(days=1)
        
        # Calculate weekly profit/loss
        weekly_data = []
        current_date = start_date
        
        while current_date <= end_date:
            week_start = current_date
            week_end = min(current_date + timedelta(days=6), end_date)
            
            weekly_sales = sales.filter(created_at__date__range=[week_start, week_end])
            weekly_revenue = weekly_sales.aggregate(total=Sum('final_amount'))['total'] or Decimal('0')
            
            weekly_items = SaleItem.objects.filter(sale__in=weekly_sales)
            weekly_profit = weekly_items.aggregate(profit=Sum('profit'))['profit'] or Decimal('0')
            
            weekly_loss = weekly_items.filter(unit_price__lt=F('cost_price')).aggregate(
                loss=Sum((F('cost_price') - F('unit_price')) * F('quantity'))
            )['loss'] or Decimal('0')
            
            weekly_cost = weekly_items.aggregate(cost=Sum(F('cost_price') * F('quantity')))['cost'] or Decimal('0')
            
            weekly_data.append(ProfitLossType(
                date=f"{week_start.isoformat()} to {week_end.isoformat()}",
                profit=weekly_profit,
                loss=weekly_loss,
                revenue=weekly_revenue,
                cost=weekly_cost
            ))
            
            current_date += timedelta(days=7)
        
        # Calculate totals
        total_profit = SaleItem.objects.filter(sale__in=sales).aggregate(
            profit=Sum('profit')
        )['profit'] or Decimal('0')
        
        total_loss = SaleItem.objects.filter(sale__in=sales, unit_price__lt=F('cost_price')).aggregate(
            loss=Sum((F('cost_price') - F('unit_price')) * F('quantity'))
        )['loss'] or Decimal('0')
        
        total_revenue = sales.aggregate(revenue=Sum('final_amount'))['revenue'] or Decimal('0')
        
        return ProfitLossAnalytics(
            daily=daily_data,
            weekly=weekly_data,
            total_profit=total_profit,
            total_loss=total_loss,
            total_revenue=total_revenue
        )