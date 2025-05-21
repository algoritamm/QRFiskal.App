import matplotlib.pyplot as plt # type: ignore

def event_impact(sales_data, release_data):
    plt.figure(figsize=(12, 6))
    plt.plot(sales_data["date"], sales_data["ps5_sales"], label="PS5 Sales")
    
    for _, row in release_data.iterrows():
        plt.axvline(row["release_date"], color="red", linestyle="--", alpha=0.7)
        plt.text(row["release_date"], max(sales_data["ps5_sales"]), row["game"], rotation=90, fontsize=8)
    
    plt.title("Impact of game releases on PS5 sales")
    plt.xlabel("Date")
    plt.ylabel("Number of sold consoles")
    plt.legend()
    plt.tight_layout()
    plt.savefig("event_impact.png")
    plt.close()