import './spinner.styles.scss';


const Spinner = () => {
    return (
        <div className='spinner-container'>
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default Spinner;