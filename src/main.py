from data_loader import load_data
from event_impact import event_impact
from sales_forecast import forecast_sales

def main():
    print("Data loading...")
    sales_data, release_data = load_data()
    print("==================================================")
    print("Sales data: ")
    print(sales_data)
    print("Release data: ")
    print(release_data)
    print("==================================================")

    print("Game release analysis...")
    event_impact(sales_data, release_data)

    print("Sales forecast...")
    forecast_sales(sales_data)

if __name__ == "__main__":
    main()
