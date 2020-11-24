import IComments from "./IComments";


interface ICommentList {
    trips_by_pk:{
        comments?: IComments[];
    }
}

export default ICommentList;