# Python script to fetch and print the HTTP status code of a URL.
import requests

def get_url_status(url: str):
    """
    Fetches a URL and prints its HTTP status code.
    Handles potential requests.exceptions.RequestException.
    """
    try:
        response = requests.get(url)
        print(f"Status code for {url}: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL {url}: {e}")

if __name__ == "__main__":
    get_url_status("https://www.example.com")
