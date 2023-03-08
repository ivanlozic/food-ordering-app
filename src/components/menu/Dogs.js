import classes from "./Pasta.module.css";
import { useEffect, useState } from "react";

const Dogs = ({ modal }) => {
  const [dogList, setDogList] = useState([]);

  useEffect(() => {
    fetch("https://food-ordering-app-api.onrender.com/api/dogs")
      .then((response) => response.json())
      .then((data) => setDogList(data));
  }, []);

  return (
    <div id="dogs">
      <h2 style={{ marginLeft: "2rem" }}>DOGS</h2>
      <div className={classes.box}>
        {dogList.map((dog) => {
          return (
            <div
              key={dog.id}
              className={classes.container}
              onClick={() => modal(dog)}
            >
              <div className={classes.info}>
                <h3>{dog.title}</h3>
                <p>{dog.description}</p>
                <p className={classes.price}>RSD {dog.price}.00</p>
              </div>

              <img
                className={classes.img}
                src={`https://food-ordering-app-api.onrender.com/image/dogs/${dog.id}.jpeg`}
                alt={dog.title}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dogs;