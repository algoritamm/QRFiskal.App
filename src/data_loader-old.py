import numpy as np # type: ignore
import csv
from datetime import datetime

def getDataFromFile(filename, column_name):
    data = []
    with open (filename, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        header = next(reader) ## Skip first row
        data.append(header)

        if column_name not in header:
            raise ValueError(f"Column {column_name} not found in {filename}")
        idx = header.index(column_name)

        for row in reader:
            row[idx] = datetime.strptime(row[idx], "%Y-%m-%d").date()
            data.append(row)
    data = np.array(data)

    return data

def load_data():
    sales_data = getDataFromFile("data/sales_data.csv", "date")
    release_data = getDataFromFile("data/release_events.csv", "release_date")
    return sales_data, release_data