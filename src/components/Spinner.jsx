const Spinner = () => {
    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div
                className="spinner-border"
                style={{ color: "var(--green)", width: "40px", height: "40px" }}
                role="status"
            >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;