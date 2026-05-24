import "./ShowItem.css"

interface ShowItemImageProps {
    imageUrl: string;
    altText: string;
}

const ShowItemImage = ({ imageUrl, altText }: ShowItemImageProps) => {
    return (
        <div className="show-item-image-box">
        <img src={imageUrl} alt={altText} className="show-item-img" />
        </div>
    );
};

export default ShowItemImage;