class CustomError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports={
    CustomError,
    UnhandledError:class extends CustomError{
        constructor(message) {
            super("Unhandled Error! "+message);
        }
    },
    ExternalApiRequestError:class extends CustomError{
        constructor(apiName,message){
            super("ExternalAPI Error! in "+apiName+" API :"+message);
        }
    }
};