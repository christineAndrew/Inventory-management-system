#!/usr/bin/env python3
import requests
import time
import json

def test_frontend():
    """Test if the frontend is accessible"""
    try:
        # Test main frontend page
        response = requests.get("http://localhost:5174", timeout=5)
        print(f"Frontend status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Frontend is accessible")
            
            # Check if it contains React app content
            if "vite" in response.text.lower() or "react" in response.text.lower():
                print("✅ React/Vite app is loading")
            
            print("📋 Test the analytics page by visiting: http://localhost:5174/analytics")
            return True
        else:
            print("❌ Frontend not accessible")
            return False
            
    except Exception as e:
        print(f"❌ Error accessing frontend: {e}")
        return False

def test_backend():
    """Test if the backend GraphQL is working"""
    try:
        query = {
            "query": """
            query {
                analytics {
                    totalSales
                    totalProfit
                    totalProductsSold
                    averageOrderValue
                }
                profitLossAnalytics(days: 7) {
                    totalProfit
                    totalLoss
                    totalRevenue
                }
            }
            """
        }
        
        response = requests.post(
            "http://localhost:8000/graphql/",
            json=query,
            timeout=5
        )
        
        print(f"Backend GraphQL status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if "data" in data and not data.get("errors"):
                print("✅ Backend GraphQL is working")
                print("✅ Analytics queries are responding")
                
                # Show sample data
                analytics = data["data"]["analytics"]
                profit_loss = data["data"]["profitLossAnalytics"]
                
                print(f"   Total Sales: ${analytics['totalSales']}")
                print(f"   Total Products Sold: {analytics['totalProductsSold']}")
                print(f"   Total Revenue: ${profit_loss['totalRevenue']}")
                return True
            else:
                print("❌ GraphQL errors:", data.get("errors"))
                return False
        else:
            print("❌ Backend not responding properly")
            return False
            
    except Exception as e:
        print(f"❌ Error accessing backend: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Shop1 Application...")
    print("="*50)
    
    backend_ok = test_backend()
    frontend_ok = test_frontend()
    
    print("\n📊 Test Results:")
    print("="*50)
    
    if backend_ok and frontend_ok:
        print("✅ Both frontend and backend are working!")
        print("🚀 You can access the shop at: http://localhost:5174")
        print("📈 Analytics page: http://localhost:5174/analytics")
        print("\n💡 Note: Make sure both servers are running:")
        print("   Backend: http://localhost:8000")
        print("   Frontend: http://localhost:5174")
    else:
        print("❌ Some issues detected:")
        if not backend_ok:
            print("   - Backend GraphQL server issues")
        if not frontend_ok:
            print("   - Frontend server issues")
