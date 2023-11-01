import json
import sys
import pymongo
import random
from bson.objectid import ObjectId

client = pymongo.MongoClient("mongodb+srv://Yatra:Yatra@yatrasahayak.0gw5pwg.mongodb.net/?retryWrites=true&w=majority")

attraction_db = client["Attractions"]
attractions_collection = attraction_db["attractions_in_mumbai"]
attractions_data = list(attractions_collection.find({}))

hotel_db = client["Hotels"]
hotels_collection = hotel_db["Hotels_in_Mumbai"]
hotels_data = list(hotels_collection.find({}))

restaurant_db = client["Restaurants"]
restaurants_collection = restaurant_db["restaurants_in_mumbai"]
restaurants_data = list(restaurants_collection.find({}))

bus_db = client["Buses"]
bus_collection = bus_db["buses"]
bus_data = list(bus_collection.find({}))

train_db = client["Trains"]
trains_collection = train_db["trains"]
trains_data = list(trains_collection.find({}))

flight_db = client["Flights"]
flights_collection = flight_db["flights"]
flights_data = list(flights_collection.find({}))

return_bus_db = client["Buses_return"]
return_bus_collection = return_bus_db["Buses_return"]
bus_data_return = list(return_bus_collection.find({}))

return_train_db = client["Trains_return"]
return_trains_collection = return_train_db["trains_return"]
trains_data_return = list(return_trains_collection.find({}))

return_flight_db = client["Flights_return"]
return_flights_collection = return_flight_db["flights_return"]
flights_data_return = list(return_flights_collection.find({}))




class GreedyTravelItineraryModel:
    def __init__(self, attractions_data, hotels_data, restaurants_data, bus_data, trains_data, flights_data, bus_data_return, trains_data_return, flights_data_return):
        self.attractions_data = attractions_data
        self.hotels_data = hotels_data
        self.restaurants_data = restaurants_data
        self.bus_data = bus_data
        self.trains_data = trains_data
        self.flights_data = flights_data
        self.bus_data_return = bus_data_return
        self.trains_data_return = trains_data_return
        self.flights_data_return = flights_data_return

    def is_valid_numeric(self, value):
        try:
            float(value)
            return True
        except (ValueError, TypeError):
            return False

    def generate_itinerary(self, num_travelers, start_location, destination, date_of_departure, date_of_return, duration_of_stay, transportationType, preferences={}):
        # Initialize the itinerary
        itinerary = []

        # Choose the best transportation option
        transportation_options = []
        if transportationType == 'bus':
            transportation_options = self.bus_data
            return_transportation_options = self.bus_data_return
        elif transportationType == 'train':
            transportation_options = self.trains_data
            return_transportation_options = self.trains_data_return
        elif transportationType == 'flight':
            transportation_options = self.flights_data
            return_transportation_options = self.flights_data_return

        transportation = None
        for transportation_option in transportation_options:
            if "price" in transportation_option and transportation_option["price"]:
                try:
                    # Convert to float
                    price = float(transportation_option["price"])
                    if transportation_option.get("departure_date") == date_of_departure and transportation_option.get(
                            "departure") == start_location and transportation_option.get("destination") == destination:
                        if transportation is None or price < float(transportation.get("price", float('inf'))):
                            transportation = transportation_option
                except ValueError:
                    print("Invalid 'price' value for transportation:",
                          transportation_option.get("price"))

        # Choose the best return_transportation option
        return_transportation = None
        for return_transportation_option in return_transportation_options:
            if "price" in return_transportation_option and return_transportation_option["price"]:
                try:
                    # Convert to float
                    price = float(return_transportation_option["price"])
                    if return_transportation_option.get("departure_date") == date_of_return and return_transportation_option.get(
                            "departure") == destination and return_transportation_option.get("destination") == start_location:
                        if return_transportation is None or price < float(return_transportation.get("price", float('inf'))):
                            return_transportation = return_transportation_option
                except ValueError:
                    print("Invalid 'price' value for return transportation:",
                          return_transportation_option.get("price"))

        # Define rating ranges
        rating_ranges = [(1, 2), (2, 3), (3, 4), (4, 5)]

        hotels = []
        for i in range(2 * duration_of_stay):
            # Randomly shuffle the rating ranges
            random.shuffle(rating_ranges)

            # Fetch a hotel for each rating range
            for rating_range in rating_ranges:
                # Fetch hotels within the selected rating range
                available_hotels = [hotel for hotel in self.hotels_data if
                                    self.is_valid_numeric(hotel.get("price")) and
                                    self.is_valid_numeric(hotel.get("score")) and
                                    float(hotel.get("score", 0)) >= rating_range[0] and
                                    float(hotel.get("score", 0)) < rating_range[1] and
                                    hotel.get("checkin") == date_of_departure]

                if available_hotels:
                    selected_hotel = random.choice(available_hotels)
                    hotels.append(selected_hotel)

        # Choose the best restaurants
        restaurants = []
        num_restaurants = min(2 * duration_of_stay, len(self.restaurants_data))
        for restaurant_option in self.restaurants_data[:num_restaurants]:
            if restaurant_option.get("price"):
                restaurants.append(restaurant_option)

        # Calculate the minimum and maximum prices for each component
        max_transportation_price = float(transportation["price"]) if transportation else 0
        min_transportation_price = float(transportation["price"]) if transportation else float('inf')
        max_return_transportation_price = float(return_transportation["price"]) if return_transportation else 0
        min_return_transportation_price = float(return_transportation["price"]) if return_transportation else float('inf')
        max_hotel_price = max(float(hotel["price"]) for hotel in hotels) if hotels else 0
        min_hotel_price = min(float(hotel["price"]) for hotel in hotels) if hotels else float('inf')
        max_restaurant_price = max(float(restaurant["price"]) for restaurant in restaurants) if restaurants else 0
        min_restaurant_price = min(float(restaurant["price"]) for restaurant in restaurants) if restaurants else float('inf')

        max_transportation_cost = max_transportation_price * num_travelers
        min_transportation_cost = min_transportation_price * num_travelers
        max_return_transportation_cost = max_return_transportation_price * num_travelers
        min_return_transportation_cost = min_return_transportation_price * num_travelers
        max_hotel_cost = max_hotel_price * duration_of_stay * num_travelers
        min_hotel_cost = min_hotel_price * duration_of_stay * num_travelers
        max_restaurant_cost = max_restaurant_price * num_travelers
        min_restaurant_cost = min_restaurant_price * num_travelers
        
        ranges = []

        total_maximum_cost = (max_transportation_cost + max_return_transportation_cost + max_hotel_cost + max_restaurant_cost)
        total_minimum_cost = (min_transportation_cost + min_return_transportation_cost + min_hotel_cost + min_restaurant_cost)

        ranges.append(total_maximum_cost)
        ranges.append(total_minimum_cost)

        return itinerary, ranges


# data = json.loads(sys.argv[1])

# Initialize the model
travel_itinerary_model = GreedyTravelItineraryModel(attractions_data, hotels_data, restaurants_data, bus_data, trains_data, flights_data, bus_data_return, trains_data_return, flights_data_return)


# Generate the itinerary
# itinerary, ranges = travel_itinerary_model.generate_itinerary(data['num_travelers'], data['start_location'], data['destination'], data['date_of_departure'], data['date_of_return'], data['duration_of_stay'], data['transportationType'])
itinerary, ranges = travel_itinerary_model.generate_itinerary(1, "Pune", "Mumbai", "12-10-2023", "14-10-2023", 2, "bus")


if ranges is not None:
    for item in ranges:
        ranges.append(item)

# Create a dictionary containing the itinerary and calculations
result = {
    'ranges': {
    'budget': ranges
    }
}


# Serialize the itinerary result using the custom JSON encoder
result = json.dumps(result)

# Send the itinerary result to the client
print(result)
