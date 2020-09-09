import IComments from "./IComments";

interface IPost {
    id: number;
    title: string;
    description: string;
    user: {
        display_name: string
    };
    comments?: IComments[];

   /* image: string;
    likes: number; */
}

export default IPost;