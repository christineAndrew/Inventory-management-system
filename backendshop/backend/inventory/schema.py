# File: inventory/schema.py
import graphene
from graphene_django import DjangoObjectType
from django.db.models import Sum, Q, F, Count
from django.utils import timezone
from datetime import timedelta, datetime
from decimal import Decimal
from .models import Product, Sale

class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = "__all__"

# File: inventory/schema.py
# ... existing code ...

class ProductInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    description = graphene.String()
    category = graphene.String(required=True)  # Make sure this exists
    cost_price = graphene.Decimal(required=True)
    selling_price = graphene.Decimal(required=True)

# ... rest of the schema code ...


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

class Mutation(graphene.ObjectType):
    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    delete_product = DeleteProduct.Field()



    # File: inventory/schema.py


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

class RecentSaleType(graphene.ObjectType):
    id = graphene.Int()
    product_name = graphene.String()
    quantity = graphene.Int()
    amount = graphene.Decimal()
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
    def resolve_dashboard_data(self, info):
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        # Calculate daily profit (today's sales profit)
        daily_sales = Sale.objects.filter(sale_date__date=today)
        daily_profit = daily_sales.aggregate(
            total_profit=Sum((F('selling_price') - F('cost_price')) * F('quantity'))
        )['total_profit'] or Decimal('0.00')
        
        # Calculate weekly profit (last 7 days sales profit)
        weekly_sales = Sale.objects.filter(sale_date__date__gte=week_ago)
        weekly_profit = weekly_sales.aggregate(
            total_profit=Sum((F('selling_price') - F('cost_price')) * F('quantity'))
        )['total_profit'] or Decimal('0.00')
        
        # For this example, we'll calculate loss as products that were sold below cost
        # You might have a different way to track losses
        daily_loss = daily_sales.filter(selling_price__lt=F('cost_price')).aggregate(
            total_loss=Sum((F('cost_price') - F('selling_price')) * F('quantity'))
        )['total_loss'] or Decimal('0.00')
        
        weekly_loss = weekly_sales.filter(selling_price__lt=F('cost_price')).aggregate(
            total_loss=Sum((F('cost_price') - F('selling_price')) * F('quantity'))
        )['total_loss'] or Decimal('0.00')
        
        total_products = Product.objects.count()
        products_sold_today = daily_sales.aggregate(total_sold=Sum('quantity'))['total_sold'] or 0
        
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
        recent_sales = Sale.objects.select_related('product').order_by('-sale_date')[:5]
        return [
            RecentSaleType(
                id=sale.id,
                product_name=sale.product.name,
                quantity=sale.quantity,
                amount=sale.selling_price * sale.quantity,
                sale_date=sale.sale_date
            )
            for sale in recent_sales
        ]
    
    def resolve_profit_loss_data(self, info):
        # Generate profit/loss data for the last 7 days
        profit_loss_data = []
        today = timezone.now().date()
        
        for i in range(6, -1, -1):  # Last 7 days including today
            date = today - timedelta(days=i)
            day_sales = Sale.objects.filter(sale_date__date=date)
            
            profit = day_sales.aggregate(
                total_profit=Sum((F('selling_price') - F('cost_price')) * F('quantity'))
            )['total_profit'] or Decimal('0.00')
            
            # Calculate loss for products sold below cost
            loss = day_sales.filter(selling_price__lt=F('cost_price')).aggregate(
                total_loss=Sum((F('cost_price') - F('selling_price')) * F('quantity'))
            )['total_loss'] or Decimal('0.00')
            
            profit_loss_data.append(
                ProfitLossDataType(
                    date=date.strftime('%Y-%m-%d'),
                    profit=profit,
                    loss=loss
                )
            )
        
        return profit_loss_data