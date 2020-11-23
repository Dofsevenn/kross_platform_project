import IComments from "./IComments";

interface ITrip {
    id: number;
    title?: string;
    description?: string;
    start_point?: string;
    trip_length?: string;
    image_filename?: string;
    coordinates?: string;
    user: {
        id: string;
        display_name: string;
    };
    comments?: IComments[];
}

export default ITrip;