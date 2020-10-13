
interface IComments {
    id: number;
    text: string;
    user: {
        display_name: string;
    }
    /*
    date: string; */
    profileImageUrl?: string;
}

export default IComments;