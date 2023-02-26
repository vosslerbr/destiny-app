import classTypeMap from "@/helpers/classTypeMap";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "./Store";

interface CharacterSelectProps {
  // eslint-disable-next-line no-unused-vars
  handleChange: (characterId: string) => void;
  selectedCharacterId: string;
}

export default function CharacterSelect({
  handleChange,
  selectedCharacterId,
}: CharacterSelectProps) {
  const { user } = useContext(UserContext) as UserContextType;

  const [characters, setCharacters] = useState<any[]>([]);

  useEffect(() => {
    const charIds = Object.keys(user.characters.data);

    const characterObjects: any[] = [];

    charIds.forEach((id) => {
      const character = user.characters.data[id];

      characterObjects.push(character);
    });

    setCharacters(characterObjects);
  }, [user]);

  // on mount select the first character
  useEffect(() => {
    if (characters.length > 0) {
      handleChange(characters[0].characterId);
    }
  }, [characters]);

  return (
    <div id="character-select-container">
      {characters.map((character) => {
        return (
          <span
            key={character.characterId}
            style={{
              backgroundImage: `url(https://www.bungie.net${character.emblemBackgroundPath})`,
            }}
            onClick={() => handleChange(character.characterId)}
            className={character.characterId === selectedCharacterId ? "character-selected" : ""}>
            {classTypeMap[character.classType]}
          </span>
        );
      })}
    </div>
  );
}
