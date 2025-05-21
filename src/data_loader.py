import pandas as pd # type: ignore

def load_data():
    sales_data = pd.read_csv("data/sales_data.csv", parse_dates=["date"])
    release_data = pd.read_csv("data/release_events.csv", parse_dates=["release_date"])
    return sales_data, release_data