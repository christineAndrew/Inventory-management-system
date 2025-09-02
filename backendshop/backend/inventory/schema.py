# File: inventory/schema.py
import graphene
from graphene_django import DjangoObjectType
from .models import Product
from django.db.models import Q

class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = "__all__"

class Query(graphene.ObjectType):
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
        id = graphene.Int(required=True)
        input = ProductInput(required=True)

    product = graphene.Field(ProductType)

    def mutate(self, info, id, input):
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