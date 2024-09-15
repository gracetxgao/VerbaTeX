import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import RecentsCard from "./RecentsCard";
import { auth } from '../../firebase'; 
import { fetchEquations } from "../../firestore";

type Recent = {
  text: string;
  liked: boolean;
  latex_code?: string;
  img_binary?: string;
};

const RecentsPage = () => {
  const [recents, setRecents] = useState<Recent[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const getRecents = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const equations = await fetchEquations(user.uid, false);
          const formattedRecents = equations.map((eq) => ({ // TODO add the other fields and send
            id: eq.id,
            text: eq.function,
            liked: false
          }));
          setRecents(formattedRecents);

        } catch (error) {
          console.error("Error fetching recents:", error);
        }
      } else {
        console.error("No user logged in");
      }
      setLoading(false);
    };

    getRecents();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <Navbar title="Recently used" location="recents" />
      <div className="container mx-auto p-5 flex flex-col items-center">
        <div className="w-1/2 flex flex-col">
          {recents.map((recent, index) => (
            <RecentsCard
              key={index}
              text={recent.text}
              liked={recent.liked}
              index={index}
            /> // pass in proper fields
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentsPage;
