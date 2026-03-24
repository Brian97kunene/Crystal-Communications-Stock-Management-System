import React from "react";


const FeedbackSection = ({ title, count, items, renderItem, variant }) => {
    // Determine the color based on if updates exist
    const headerClass = count > 0 ? `alert alert-${variant}` : `alert alert-light text-muted`;

    return (
        <div className="card mb-4 shadow-sm">
            <div className={`${headerClass} m-0 rounded-0 py-2 font-weight-bold`}>
                {count > 0 ? `${count} ${title} DETECTED` : `NO ${title} CHANGES`}
            </div>
            {items.length > 0 && (
                <div className="card-body p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <ul className="list-group list-group-flush">
                        {items.map((item, index) => (
                            <li key={index} className="list-group-item bg-light-hover">
                                {renderItem(item)}
                            </li>
                        ))}
                    </ul>
                </div>
            ) 
                }
        </div>
    );
};


export default FeedbackSection;