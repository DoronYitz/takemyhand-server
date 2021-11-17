import { Config } from "../config";

import { Client } from "@googlemaps/google-maps-services-js";

import CustomError from "../shared/error";

/**
 * Using google geocoding api to recive coordiantes of an address.
 *
 * @param {string} address address of the parcel/volunteer location
 * @returns {[lng: number, lat: number]} longtitue and latitude of the location
 */
export const getCoordinates = async (address: string) => {
	try {
		const geocodingClient = new Client({});
		let params = {
			address: address,
			components: "country:IL",
			key: Config.GEOCODE_API_KEY,
		};
		const response = await geocodingClient.geocode({ params: params });
		if (response.data.status === "OK") {
			const { lng, lat } = response.data.results[0].geometry.location;
			return [lng, lat];
		} else if (response.data.status === "ZERO_RESULTS") {
			const { lng, lat } = Config.DEFAULT_COORDINATE;
			return [lng, lat];
		}
		throw new CustomError(404, `Coordinates not found`);
	} catch (err) {
		console.log(err);
		throw err;
	}
};
