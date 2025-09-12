# File: inventory/schema.py
import graphene
from graphene_django import DjangoObjectType
from django.db.models import Sum, Q, F
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from .models import Product, Sale, SaleItem, Store, Stock, InventoryMovement
import random
import string

# -------------------------
# Object Types
# -------------------------

class StoreType(DjangoObjectType):
    class Meta:
        model = Store
        fields = "__all__"
    
    is_active = graphene.Field(graphene.Boolean, name='isActive')
    
    def resolve_is_active(self, info):
        return self.is_active

class StockType(DjangoObjectType):
    class Meta:
        model = Stock
        fields = "__all__"

    product_name = graphene.String()
    store_name = graphene.String()
    low_stock_threshold = graphene.Field(graphene.Int, name='lowStockThreshold')
    last_updated = graphene.Field(graphene.DateTime, name='lastUpdated')

    def resolve_product_name(self, info):
        return self.product.name

    def resolve_store_name(self, info):
        return self.store.name
    
    def resolve_low_stock_threshold(self, info):
        return self.low_stock_threshold
        
    def resolve_last_updated(self, info):
        return self.last_updated

class InventoryMovementType(DjangoObjectType):
    class Meta:
        model = InventoryMovement
        fields = "__all__"

    product_name = graphene.String()
    store_name = graphene.String()
    movement_type_display = graphene.String()

    def resolve_product_name(self, info):
        return self.product.name

    def resolve_store_name(self, info):
        return self.store.name

    def resolve_movement_type_display(self, info):
        return self.get_movement_type_display()

class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = "__all__"

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

class SaleType(DjangoObjectType):
    class Meta:
        model = Sale
        fields = "__all__"

    total_amount = graphene.Decimal()
    tax_amount = graphene.Decimal()
    discount_amount = graphene.Decimal()
    final_amount = graphene.Decimal()
    items = graphene.List(lambda: SaleItemType)

    def resolve_items(self, info):
        return self.items.all()

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

# -------------------------
# Input Types
# -------------------------

class ProductInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    description = graphene.String()
    category = graphene.String(required=True)
    cost_price = graphene.Decimal(required=True)
    selling_price = graphene.Decimal(required=True)

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

class StockInput(graphene.InputObjectType):
    product_id = graphene.Int(required=True)
    store_id = graphene.Int(required=True)
    quantity = graphene.Int(required=True)
    low_stock_threshold = graphene.Int()

class StockMovementInput(graphene.InputObjectType):
    product_id = graphene.Int(required=True)
    store_id = graphene.Int(required=True)
    quantity = graphene.Int(required=True)
    movement_type = graphene.String(required=True)
    reason = graphene.String()
    reference = graphene.String()

# -------------------------
# Mutations
# -------------------------

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
        sale_number = 'S' + ''.join(random.choices(string.digits, k=6))
        while Sale.objects.filter(sale_number=sale_number).exists():
            sale_number = 'S' + ''.join(random.choices(string.digits, k=6))

        total_amount = Decimal('0')
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

        tax_amount = input.tax_amount or Decimal('0')
        discount_amount = input.discount_amount or Decimal('0')
        final_amount = total_amount + tax_amount - discount_amount

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

        for item_data in sale_items_data:
            SaleItem.objects.create(sale=sale, **item_data)

        return CreateSale(sale=sale)

class UpdateStock(graphene.Mutation):
    class Arguments:
        input = StockInput(required=True)

    stock = graphene.Field(StockType)
    movement = graphene.Field(InventoryMovementType)

    def mutate(self, info, input):
        stock, created = Stock.objects.get_or_create(
            product_id=input.product_id,
            store_id=input.store_id,
            defaults={'quantity': input.quantity}
        )

        previous_quantity = stock.quantity if not created else 0
        if not created:
            stock.quantity = input.quantity
            if input.low_stock_threshold:
                stock.low_stock_threshold = input.low_stock_threshold
            stock.save()

        movement_type = 'ADJ' if not created else 'IN'
        movement = InventoryMovement.objects.create(
            product_id=input.product_id,
            store_id=input.store_id,
            movement_type=movement_type,
            quantity=input.quantity - previous_quantity if not created else input.quantity,
            previous_quantity=previous_quantity,
            new_quantity=input.quantity,
            reason="Manual stock adjustment" if not created else "Initial stock",
            created_by=info.context.user if info.context.user.is_authenticated else None
        )

        return UpdateStock(stock=stock, movement=movement)

class CreateStockMovement(graphene.Mutation):
    class Arguments:
        input = StockMovementInput(required=True)

    movement = graphene.Field(InventoryMovementType)
    stock = graphene.Field(StockType)

    def mutate(self, info, input):
        stock, created = Stock.objects.get_or_create(
            product_id=input.product_id,
            store_id=input.store_id,
            defaults={'quantity': 0}
        )

        previous_quantity = stock.quantity
        if input.movement_type == 'IN':
            stock.quantity += input.quantity
        elif input.movement_type == 'OUT':
            stock.quantity = max(0, stock.quantity - input.quantity)
        stock.save()

        movement = InventoryMovement.objects.create(
            product_id=input.product_id,
            store_id=input.store_id,
            movement_type=input.movement_type,
            quantity=input.quantity,
            previous_quantity=previous_quantity,
            new_quantity=stock.quantity,
            reason=input.reason,
            reference=input.reference,
            created_by=info.context.user if info.context.user.is_authenticated else None
        )

        return CreateStockMovement(movement=movement, stock=stock)

# -------------------------
# Root Mutation
# -------------------------

class Mutation(graphene.ObjectType):
    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    delete_product = DeleteProduct.Field()
    create_sale = CreateSale.Field()
    update_stock = UpdateStock.Field()
    create_stock_movement = CreateStockMovement.Field()

# -------------------------
# Root Query
# -------------------------

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
    stores = graphene.List(StoreType)
    store = graphene.Field(StoreType, id=graphene.Int())
    stocks = graphene.List(StockType, store_id=graphene.Int(), product_id=graphene.Int(), low_stock=graphene.Boolean())
    stock = graphene.Field(StockType, id=graphene.Int())
    inventory_movements = graphene.List(
        InventoryMovementType,
        store_id=graphene.Int(),
        product_id=graphene.Int(),
        movement_type=graphene.String(),
        days=graphene.Int()
    )

    # -------------------------
    # Query Resolvers
    # -------------------------

    def resolve_products(self, info, search=None, **kwargs):
        if search:
            filter = Q(name__icontains=search) | Q(description__icontains=search) | Q(category__icontains=search)
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
        daily_sales = Sale.objects.filter(created_at__date=today)
        daily_profit = daily_sales.aggregate(total_profit=Sum('final_amount'))['total_profit'] or Decimal('0.00')
        weekly_sales = Sale.objects.filter(created_at__date__gte=week_ago)
        weekly_profit = weekly_sales.aggregate(total_profit=Sum('final_amount'))['total_profit'] or Decimal('0.00')
        total_products = Product.objects.count()
        products_sold_today = daily_sales.aggregate(total_sold=Sum('items__quantity'))['total_sold'] or 0
        return DashboardDataType(
            daily_profit=daily_profit,
            weekly_profit=weekly_profit,
            daily_loss=Decimal('0.00'),
            weekly_loss=Decimal('0.00'),
            total_products=total_products,
            products_sold_today=products_sold_today
        )

    def resolve_low_stock_items(self, info):
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
        profit_loss_data = []
        today = timezone.now().date()
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            day_sales = Sale.objects.filter(created_at__date=date)
            profit = day_sales.aggregate(total_profit=Sum('final_amount'))['total_profit'] or Decimal('0.00')
            profit_loss_data.append(ProfitLossDataType(date=date.strftime('%Y-%m-%d'), profit=profit, loss=Decimal('0.00')))
        return profit_loss_data

    def resolve_stores(self, info):
        return Store.objects.filter(is_active=True)

    def resolve_store(self, info, id):
        return Store.objects.get(id=id)

    def resolve_stocks(self, info, store_id=None, product_id=None, low_stock=None):
        queryset = Stock.objects.select_related('product', 'store')
        if store_id:
            queryset = queryset.filter(store_id=store_id)
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        if low_stock:
            queryset = queryset.filter(quantity__lte=F('low_stock_threshold'))
        return queryset

    def resolve_stock(self, info, id):
        return Stock.objects.get(id=id)

    def resolve_inventory_movements(self, info, store_id=None, product_id=None, movement_type=None, days=None):
        queryset = InventoryMovement.objects.select_related('product', 'store')
        if store_id:
            queryset = queryset.filter(store_id=store_id)
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        if movement_type:
            queryset = queryset.filter(movement_type=movement_type)
        if days:
            start_date = timezone.now() - timedelta(days=days)
            queryset = queryset.filter(created_at__gte=start_date)
        return queryset.order_by('-created_at')
