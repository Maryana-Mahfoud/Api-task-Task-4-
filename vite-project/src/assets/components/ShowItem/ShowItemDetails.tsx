import "./ShowItem.css";

interface ShowItemDetailsProps {
    price: number | string;
    createdAt?: string;
    updatedAt?: string;
}

const ShowItemDetails = ({ price, createdAt, updatedAt }: ShowItemDetailsProps) => {
    
    // function to style date
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "00/00/0000";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "00/00/0000";

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    return (
        <div className="show-item-details-box">
            
            <div className="info-row price-row">
                <span className="info-label">Price:</span>
                <div className="info-spacer price-line"></div>
                <span className="info-value price-value">{price}$</span>
            </div>

            <div className="info-row">
                <span className="info-label">Added At:</span>
                <div className="info-spacer"></div>
                <span className="info-value date-value">{formatDate(createdAt)}</span>
            </div>

            
            <div className="info-row">
                <span className="info-label">Updated At:</span>
                <div className="info-spacer"></div>
                <span className="info-value date-value">{formatDate(updatedAt)}</span>
            </div>
        </div>
    );
};

export default ShowItemDetails;