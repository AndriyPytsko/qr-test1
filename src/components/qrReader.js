import {useEffect, useState} from "react";
import { QrReader } from "react-qr-reader";

export const Test = () => {
    const [selected, setSelected] = useState("environment");
    const [startScan, setStartScan] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        console.log("first");
        const cart = localStorage.getItem('cart');
        if(cart) {
            setData(JSON.parse(cart));
        }
    }, [])

   const onResult = (result, error) => {
       if (!!result) {
           setData(prevState => {
               const newState = {...prevState, [result?.text]: 1};
               localStorage.setItem('cart', JSON.stringify(newState))
               return newState
           });
       }

       if (!!error) {
           console.info(error);
       }
   }

   const incrementItemCount = (key) => {
        setData(prevState => {
            const newState = {...prevState, [key]: prevState[key] + 1}
            localStorage.setItem('cart', JSON.stringify(newState))
            return newState
        })
   }

    const decrementItemCount = (key) => {
        setData(prevState => {
            const newValue = prevState[key] > 1 ? prevState[key] - 1 : 1;
            const newState = {...prevState, [key]: newValue}
            localStorage.setItem('cart', JSON.stringify(newState))
            return newState
        })
    }

    const deleteItem = key => {
        setData(prevState => {
            const { ...newState } = prevState;
            delete newState[key];
            localStorage.setItem('cart', JSON.stringify(newState))
            return newState
        })
    }
    return (
        <div className="App">
            <h1>QR Reader</h1>
            <button
                onClick={() => {
                    setStartScan(!startScan);
                }}
            >
                {startScan ? "Stop Scan" : "Start Scan"}
            </button>
            {startScan && (
                <>
                    <select onChange={(e) => setSelected(e.target.value)}>
                        <option value={"environment"}>Back Camera</option>
                        <option value={"user"}>Front Camera</option>
                    </select>
                    <QrReader
                        facingMode={selected}
                        delay={1000}
                        onResult={onResult}
                        style={{ width: "300px" }}
                    />
                </>
            )}
            <p>data: </p>
            <p>
                {Object.entries(data).map(item => (
                    <div>
                        <span>{item[0]}</span> :
                        <span className="buttons" onClick={() => decrementItemCount(item[0])}>-</span>
                        <span>{item[1]}</span>
                        <span className="buttons" onClick={() => incrementItemCount(item[0])}>+</span>
                        <span className="buttons" onClick={() => deleteItem(item[0])}>delete</span>
                    </div>))
                }
            </p>
        </div>
    );
};

