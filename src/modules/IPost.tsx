import IComments from "./IComments";

interface IPost {
    id: number;
    title: string;
    description: string;
    image_filename: string;
    user: {
        id: string;
        display_name: string
    };
    comments?: IComments[];

   /* image: string;
    likes: number; */
}

export default IPost;