const tryCatchAsync = async fn => {
    try {
        fn()
    } catch (error) {
        console.log(error)
    }
}