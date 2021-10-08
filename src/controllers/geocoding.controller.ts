import { Client } from "@googlemaps/google-maps-services-js";
import { Config } from "../config";

export const getCoordinates = async (address: string) => {
	try {
		const geocodingClient = new Client({});
		let params = {
			address: address,
			components: "country:IL",
			key: Config.GEOCODE_API_KEY,
		};
		const response = await geocodingClient.geocode({ params: params });
		let lat: number, lng: number;
		if (response.data.status === "OK") {
			lat = response.data.results[0].geometry.location.lat;
			lng = response.data.results[0].geometry.location.lng;
			console.log(`lat: ${lat}, lng: ${lng}`);
		}
		if (response.data.status === "ZERO_RESULTS") {
			lat = Config.DEFAULT_COORDINATE.lat;
			lng = Config.DEFAULT_COORDINATE.lng;
			console.log(`DEFAULT!!!!! lat: ${lat}, lng: ${lng}`);
		}
		return { lng, lat };
	} catch (err) {
		console.log("error retrieving geocoded results");
	}
};
