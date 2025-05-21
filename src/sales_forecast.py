from prophet import Prophet # type: ignore
import matplotlib.pyplot as plt # type: ignore

def forecast_sales(sales_data):
    df = sales_data[["date", "ps5_sales"]].rename(columns={"date": "ds", "ps5_sales": "y"})
    
    model = Prophet()
    model.fit(df)
    
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    
    ## Get only future dates
    future_forecast = forecast[forecast["ds"] > sales_data["date"].max()]

    # Bar chart
    plt.figure(figsize=(12, 6))
    plt.bar(future_forecast["ds"], future_forecast["yhat"], color="skyblue")
    plt.xticks(rotation=45)
    plt.title("Sales forecast for the next 30 days")
    plt.xlabel("Date")
    plt.ylabel("Sales")
    plt.tight_layout()
    plt.savefig("sales_forecast.png")
    plt.close()
