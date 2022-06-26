const galleryReducer = (oldGallery, action) =>
{
    const { type, gallery, image } = action;
    switch (type)
    {
        case "ADD":
            return [...oldGallery, gallery]
        case "REMOVE":
            return oldGallery.filter((img) => img.name !== image)
        default:
            return oldGallery
    }
}

export default galleryReducer;