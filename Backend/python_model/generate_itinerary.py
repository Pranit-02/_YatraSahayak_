import json
import sys
import pymongo
import random
from bson.objectid import ObjectId

client = pymongo.MongoClient(
    "mongodb+srv://Yatra:Yatra@yatrasahayak.0gw5pwg.mongodb.net/?retryWrites=true&w=majority")

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


# from typing import List, Dict


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

    def generate_itinerary(self, num_travelers, start_location, destination, budget, date_of_departure, date_of_return, duration_of_stay, transportationType, preferences={}):

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
                    if price <= budget and transportation_option.get("departure_date") == date_of_departure and transportation_option.get("departure") == start_location and transportation_option.get("destination") == destination:
                        if transportation is None or price < float(transportation.get("price", float('inf'))):
                            transportation = transportation_option
                except ValueError:
                    print("Invalid 'price' value for transportation:",
                          transportation_option["price"])

        # Choose the best return_transportation option
        # Corrected code to access "price" field instead of "price"
        return_transportation = None
        for return_transportation_option in return_transportation_options:
            if "price" in return_transportation_option and return_transportation_option["price"]:
                try:
                    # Convert to float
                    price = float(return_transportation_option["price"])
                    if price <= budget and return_transportation_option.get("departure_date") == date_of_return and return_transportation_option.get("departure") == destination and return_transportation_option.get("destination") == start_location:
                        if return_transportation is None or price < float(return_transportation.get("price", float('inf'))):
                            return_transportation = return_transportation_option
                except ValueError:
                    print("Invalid 'price' value for return transportation:",
                          return_transportation_option["price"])

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
                                    hotel["price"] <= budget and
                                    self.is_valid_numeric(hotel.get("score")) and
                                    float(hotel.get("score", 0)) >= rating_range[0] and
                                    float(hotel.get("score", 0)) < rating_range[1] and
                                    hotel["checkin"] == date_of_departure]

                if available_hotels:
                    selected_hotel = random.choice(available_hotels)
                    hotels.append(selected_hotel)

        # Choose the best restaurants
        restaurants = []
        num_restaurants = min(2 * duration_of_stay, len(self.restaurants_data))
        for restaurant_option in self.restaurants_data[:num_restaurants]:
            if restaurant_option["price"] <= budget:
                restaurants.append(restaurant_option)

        # Choose the best attractions
        attractions = []
        num_attractions = min(4 * duration_of_stay, len(self.attractions_data))
        for attraction_option in self.attractions_data[:num_attractions]:
            attractions.append(attraction_option)

        # Add the transportation, hotel, restaurants, and attractions to the itinerary
        itinerary.append(transportation)
        for hotel in hotels:
            itinerary.append(hotel)
        for restaurant in restaurants:
            itinerary.append(restaurant)
        for attraction in attractions:
            itinerary.append(attraction)
        itinerary.append(return_transportation)

        # # Calculate the total cost of the itinerary
        # total_cost = 0
        # # Multiply the price of each item by the number of travelers
        # total_cost = transportation['price'] * num_travelers + return_transportation['price'] * num_travelers + hotel['price'] * \
        #     num_travelers * duration_of_stay + \
        #     sum([restaurant['price']
        #         for restaurant in restaurants]) * num_travelers

        # # Check if the total cost is greater than the budget
        # if total_cost > budget:
        #     return None

        return itinerary


data = json.loads(sys.argv[1])


class ObjectIdEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


# Initialize the model
model = GreedyTravelItineraryModel(attractions_data, hotels_data, restaurants_data, bus_data,
                                   trains_data, flights_data, bus_data_return, trains_data_return, flights_data_return)

# Generate the itinerary
itinerary = model.generate_itinerary(data['num_travelers'], data['start_location'], data['destination'],
                                     data['budget'], data['date_of_departure'], data['date_of_return'], data['duration_of_stay'], data['transportationType'])


# Calculate the total cost of the itinerary
total_cost_transportation = 0
total_cost_return_transportation = 0
total_cost_hotel = 0
total_cost_food = 0
# total_cost_attractions = 0
total_cost_transportation_both = 0
restaurant_items = []
attractions_items = []
hotels_items = []

# Iterate through the itinerary and calculate costs
for item in itinerary:
    if isinstance(item, dict) and 'price' in item:
        # Check if the item is transportation, hotel, return_transportation, or attraction
        if item in bus_data + trains_data + flights_data:
            total_cost_transportation += item['price'] * data["num_travelers"]
            # transportation_items = [item]
        elif item in hotels_data:
            total_cost_hotel = item['price'] * \
                data["num_travelers"] * data["duration_of_stay"]
            # hotels_items = [item]
        elif item in bus_data_return + trains_data_return + flights_data_return:
            total_cost_return_transportation += item['price']
            # return_transportation_items = [item]
        elif item in restaurants_data:
            total_cost_food += item['price'] * data["num_travelers"]
            # restaurant_items.append(item)

total_cost_transportation_both = (
    total_cost_transportation + total_cost_return_transportation) * data["num_travelers"]
# Calculate the total cost including return transportation
total_cost = total_cost_transportation_both + total_cost_hotel + total_cost_food

if itinerary is not None:
    for item in itinerary:
        if item in bus_data + trains_data + flights_data:
            transportation_items = [item]
        elif item in hotels_data:
            hotels_items.append(item)
        elif item in bus_data_return + trains_data_return + flights_data_return:
            return_transportation_items = [item]
        elif item in restaurants_data:
            restaurant_items.append(item)
        elif item in attractions_data:
            attractions_items.append(item)

# Create a dictionary containing the itinerary and calculations
result = {
    'itinerary': {
        'transportation': transportation_items,
        'attractions': attractions_items,
        'hotels': hotels_items,
        'restaurants': restaurant_items,
        'return_transportation': return_transportation_items
    },
    'total_cost': {
        'transportation': total_cost_transportation_both,
        'hotel': total_cost_hotel,
        'food': total_cost_food,
        'total': total_cost
    }
}


# Serialize the itinerary result using the custom JSON encoder
result = json.dumps(result, cls=ObjectIdEncoder)

# Send the itinerary result to the client
print(result)
