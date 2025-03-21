import React, { useState, useEffect, useRef } from "react";
import Bird from "./components/Bird";
import Fish from "./components/Fish";
import "./styles.css";
import Torpedos from "./components/Torpedos";
import Bonus from "./components/Bonus";
import WhaleShark from "./components/WhaleShark";
import Jellyfish from "./components/Jellyfish";
import Heart from "./components/Heart";
import SeaUrchin from "./components/SeaUrchin";
import Anchor from "./components/Anchor";

const SDMANAGER = () => {

  const INIT_JELLYFISHSPEED = 2;
  const INIT_FISHSPEED = 4;
  const JELLYFISH_DELAY = 0;
  const JELLYFISH_FREQUENCY = 10000;
  const JELLYFISH_TRACK = 0.002
  const NUM_BONUSES = 3;
  const BONUS_FREQUENCY = 30000; //30000

  const [level, setLevel] = useState(1); // Start bei Level 1
  const [showLevelIndicator, setShowLevelIndicator] = useState(false); // Zum Anzeigen der Levelmeldung
  const [bonuses, setBonuses] = useState([]); // Verwaltung des Bonus
  const [slowerEffectActive, setSlowerEffectActive] = useState(false); // Bonus-Effekt
  const [lessMobsActive, setLessMobsActive] = useState(false); // Bonus-Effekt
  const [birdPosition, setBirdPosition] = useState({ x: 50, y: 200 });
  const screenWidth = 1000; // Add screen width for boundaries
  const [velocity, setVelocity] = useState(0); // Bird's vertical velocity
  const [horizontalVelocity, setHorizontalVelocity] = useState(0);
  const [fishes, setFishes] = useState([]); // Array of Fishes
  const [torpedoes, setTorpedoes] = useState([]); // Array of torpedoes
  const [whaleSharks, setWhalesharks] = useState([]); // Array of whaleSharks
  const [jellyFishes, setJellyFishes] = useState([]); // Array of jellyFish
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [fishSpeed, setFishSpeed] = useState(INIT_FISHSPEED); // Geschwindigkeit der Fish
  const [torpedoSpeed, setTorpedoSpeed] = useState(10); // Geschwindigkeit der Torpedoes
  const [whaleSharkSpeed, setWhaleSharkSpeed] = useState(2); // Geschwindigkeit der whaleSharks
  const [jellyFishSpeed, setJellyFishSpeed] = useState(INIT_JELLYFISHSPEED); // Geschwindigkeit der jellyFishSpeed
  const [seaUrchins, setSeaUrchins] = useState([]); // Array für Sea Urchins
  const passedSeaUrchinsRef = useRef(new Set()); // Um getrackte Sea Urchins zu speichern
  const [anchors, setAnchors] = useState([]); // Array für Anchor-Mobs
  const passedAnchorsRef = useRef(new Set()); // Um getrackte Anchors zu speichern

  const [lives, setLives] = useState(3);
  const [isInvincible, setIsInvincible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);  // For flashing effect

  const gravity = 0.5; // Gravity acceleration
  const jumpStrength = -10; // Initial velocity on jump
  const terminalVelocity = 10; // Maximum downward velocity
  const fishWidth = 100;
  const fishGap = 100; // Space between top and bottom fishes
  const torpedoWidth = 60; // Torpedo size
  const torpedoHeight = 20;
  const whaleSharkWidth = 200; // whaleshark size
  const whaleSharkHeight = 200;
  const jellyFishWidth = 200; // jellyFish size
  const jellyFishHeight = 200;
  const spawnX = 2000;

  const gameStartedRef = useRef(gameStarted);
  const lessMobsActiveRef = useRef(lessMobsActive)
  const gameOverRef = useRef(gameOver);
  const passedFishesRef = useRef(new Set()); // Track passed fishes by their `id`
  const passedTorpedoesRef = useRef(new Set()); // Track passed torpedoes by their `id`
  const passedWhaleSharksRef = useRef(new Set()); // Track passed whaleshark by their `id`
  const passedJellyFishesRef = useRef(new Set()); // Track passed jellyFish by their `id`

  const bonusWidth = 30; // Größe des Bonus
  const bonusHeight = 30;
  const bonusDuration = 15000; // Effekt-Dauer (20 Sekunden)

  const levelConfigs = [
    {
      level: 1,
      mobTypes: ["Fish", "Torpedo", "WhaleShark", "Jellyfish", "SeaUrchin", "Anchor"],
      jellyfishConfig: { frequency: 15000, speed: 2 },
      seaUrchinConfig: { frequency: 15000, speed: 5, verticalRange: 2 }, // Sea Urchin im Level
      anchorConfig: { frequency: 10000, acceleration: 0.3, initialSpeed: 2 }, //
    },
    {
      level: 2,
      mobTypes: ["Fish"],
      jellyfishConfig: { frequency: 12000, speed: 3 }, // Quallenmaschine etwas schneller
    },
    {
      level: 3,
      mobTypes: ["Fish", "Jellyfish"],
      jellyfishConfig: { frequency: 8000, speed: 4 }, // Häufigere Quallen
    },
  ];

  const jump = () => {
    if (!gameOver && gameStarted) {
      setVelocity(jumpStrength); // Apply upward velocity
    } else if (!gameOver && !gameStarted) {
      // Start the game on the first jump
      setGameStarted(true);
      setVelocity(jumpStrength); // Initial jump to start motion
    } else {
      // Restart the game
      setBirdPosition({ x: 50, y: 200 });
      setFishes([]);
      setTorpedoes([]);
      setWhalesharks([]);
      setJellyFishes([]);
      setSeaUrchins([]);
      setAnchors([]);
      setBonuses([]);
      setGameOver(false);
      setSlowerEffectActive(false)
      setLessMobsActive(false)
      setGameStarted(true);
      setScore(0);
      setLives(3); // Reset lives
      setVelocity(0); // Reset velocity
      setLevel(1);
      passedFishesRef.current.clear(); // Reset passed fishes tracking
      passedTorpedoesRef.current.clear(); // Reset passed torpedoes tracking
      passedWhaleSharksRef.current.clear(); // Reset passed whalesharks tracking
      passedJellyFishesRef.current.clear(); // Reset passed jellyFish tracking
      passedSeaUrchinsRef.current.clear();
      passedAnchorsRef.current.clear();
    }
  };

  useEffect(() => {
    let levelTimer: number;

    if (gameStarted && !gameOver) {
      levelTimer = setInterval(() => {
        setLevel((prevLevel) => prevLevel + 1); // Level erhöhen

        // Zeige kurz den Levelwechsel an
        setShowLevelIndicator(true);
        setTimeout(() => setShowLevelIndicator(false), 3000); // Hinweis für 3 Sekunden
      }, 60000); // Alle 60 Sekunden
    }

    return () => clearInterval(levelTimer); // Timer bereinigen
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const config = levelConfigs.find((lc) => lc.level === level) || levelConfigs[levelConfigs.length - 1];

    setJellyFishSpeed(config.jellyfishConfig.speed); // Geschwindigkeit basierend auf dem Level anpassen
  }, [level]);

  // Keep the ref in sync with state
  useEffect(() => {
    lessMobsActiveRef.current = lessMobsActive;
  }, [lessMobsActive]);

  // Add this new useEffect for the flashing effect during invincibility
  useEffect(() => {
    let flashingInterval;
    if (isInvincible) {
      flashingInterval = setInterval(() => {
        setIsVisible(prev => !prev);
      }, 200); // Flash every 200ms
    } else {
      setIsVisible(true); // Ensure bird is visible when not invincible
    }

    return () => {
      if (flashingInterval) {
        clearInterval(flashingInterval);
      }
    };
  }, [isInvincible]);

  const checkCollision = () => {
    if (isInvincible) return; // Skip collision check if invincible
    const birdTop = birdPosition.y + 10; // Adjusted hitbox
    const birdBottom = birdPosition.y + 40; // Adjusted hitbox
    const birdLeft = birdPosition.x + 10; // Adjusted hitbox
    const birdRight = birdPosition.x + 40; // Adjusted hitbox

    // Check for collision with bonus
    bonuses.forEach((bonus) => {
      const bonusLeft = bonus.x;
      const bonusRight = bonus.x + bonusWidth;
      const bonusTop = bonus.y;
      const bonusBottom = bonus.y + bonusHeight;

      const isColliding =
          birdRight > bonusLeft &&
          birdLeft < bonusRight &&
          birdBottom > bonusTop &&
          birdTop < bonusBottom;

      if (isColliding) {
        // Bonus entfernen
        setBonuses((prev) => prev.filter((b) => b.id !== bonus.id));

        // Effekt aktivieren
        const randomInt = Math.floor(Math.random() * NUM_BONUSES);
        if (randomInt == 0) {
          setSlowerEffectActive(true);
          // Geschwindigkeit verlangsamen
          const slowerFishSpeed = INIT_FISHSPEED / 2; // Verlangsamte Geschwindigkeit für Fishes
          const slowerTorpedoSpeed = 4; // Verlangsamte Geschwindigkeit für Torpedoes
          const slowerWhaleSharksSpeed = 1; // Verlangsamte Geschwindigkeit für whaleshark
          const slowerJellyFishSpeed = INIT_JELLYFISHSPEED / 2; // Verlangsamte Geschwindigkeit für whaleshark

          setFishSpeed(slowerFishSpeed);
          setTorpedoSpeed(slowerTorpedoSpeed);
          setWhaleSharkSpeed(slowerWhaleSharksSpeed);
          setJellyFishSpeed(slowerJellyFishSpeed);

          // Effekt nach 20 Sekunden deaktivieren
          setTimeout(() => {
            setFishSpeed(INIT_FISHSPEED); // Ursprüngliche Geschwindigkeit für Fishes wiederherstellen
            setTorpedoSpeed(10); // Ursprüngliche Geschwindigkeit für Torpedoes wiederherstellen
            setWhaleSharkSpeed(2); // Ursprüngliche Geschwindigkeit für whaleshark wiederherstellen
            setJellyFishSpeed(INIT_JELLYFISHSPEED); // Ursprüngliche Geschwindigkeit für whaleshark wiederherstellen
            setSlowerEffectActive(false);
          }, bonusDuration);
        } else if (randomInt == 1) {
          setSlowerEffectActive(true);
          setTimeout(() => {
            setSlowerEffectActive(false);
          }, bonusDuration);
        } else if (randomInt == 2) {
            setIsInvincible(true);
            // Remove invincibility after 2 seconds
            setTimeout(() => {
              setIsInvincible(false);
            }, bonusDuration);
        }
      }
    });

    // Collision check helper function
    const handleCollision = () => {
      if (lives > 1) {
        setLives(prev => prev - 1);
        // Activate invincibility
        setIsInvincible(true);
        // Remove invincibility after 2 seconds
        setTimeout(() => {
          setIsInvincible(false);
        }, 2000);
      } else {
        setLives(0);
        setGameOver(true);
        setGameStarted(false);
      }
    };

    seaUrchins.forEach((seaUrchin) => {
      const seaUrchinLeft = seaUrchin.x;
      const seaUrchinRight = seaUrchin.x + 50; // Breite anpassen
      const seaUrchinTop = seaUrchin.y;
      const seaUrchinBottom = seaUrchin.y + 50; // Höhe anpassen

      const isColliding =
          birdRight > seaUrchinLeft &&
          birdLeft < seaUrchinRight &&
          birdBottom > seaUrchinTop &&
          birdTop < seaUrchinBottom;

      if (isColliding) {
        handleCollision();
      }

      // Score-Erhöhung, wenn Sea Urchin passiert wird
      if (!passedSeaUrchinsRef.current.has(seaUrchin.id) && birdRight > seaUrchinRight) {
        passedSeaUrchinsRef.current.add(seaUrchin.id);
        setScore((prev) => prev + 1);
      }
    });

    // Check for collision with fishes
    fishes.forEach((fish) => {
      const fishTop = fish.y;
      const fishBottom = fish.y + fishGap;
      const fishLeft = fish.x;
      const fishRight = fish.x + fishWidth;

      const isColliding =
          (birdRight > fishLeft &&
              birdLeft < fishRight &&
              birdBottom > fishTop &&
              birdTop < fishBottom) || // Fish collision
          birdTop < 0 || // Top boundary collision
          birdBottom > 800; // Bottom boundary collision

      if (isColliding) {
        handleCollision();
      }

      // Increment score for passed fishes
      if (!passedFishesRef.current.has(fish.id) && birdRight > fishRight) {
        passedFishesRef.current.add(fish.id);
        setScore((prev) => prev + 1);
      }
    });

    // Check for collision with jellyfish
    jellyFishes.forEach((jellyFish) => {
      const jellyFishLeft = jellyFish.x;
      const jellyFishRight = jellyFish.x + jellyFishWidth;
      const jellyFishTop = jellyFish.y;
      const jellyFishBottom = jellyFish.y + jellyFishHeight;

      const isColliding =
          birdRight > jellyFishLeft &&
          birdLeft < jellyFishRight &&
          birdBottom > jellyFishTop &&
          birdTop < jellyFishBottom;

      if (isColliding) {
        handleCollision();
      }

      // Increment score for passed jellyFish
      if (!passedTorpedoesRef.current.has(jellyFish.id) && birdRight > jellyFishRight) {
        passedTorpedoesRef.current.add(jellyFish.id);
        setScore((prev) => prev + 1);
      }
    });

    // Check for collision with whaleshark
    whaleSharks.forEach((whaleShark) => {
      const whaleSharkLeft = whaleShark.x;
      const whaleSharkRight = whaleShark.x + whaleSharkWidth;
      const whaleSharkTop = whaleShark.y;
      const whaleSharkBottom = whaleShark.y + whaleSharkHeight;

      const isColliding =
          birdRight > whaleSharkLeft &&
          birdLeft < whaleSharkRight &&
          birdBottom > whaleSharkTop &&
          birdTop < whaleSharkBottom;

      if (isColliding) {
        handleCollision();
      }

      // Increment score for passed torpedoes
      if (!passedTorpedoesRef.current.has(whaleShark.id) && birdRight > whaleSharkRight) {
        passedTorpedoesRef.current.add(whaleShark.id);
        setScore((prev) => prev + 1);
      }
    });

    anchors.forEach((anchor) => {
      const anchorLeft = anchor.x;
      const anchorRight = anchor.x + 40; // Breite des Anchors
      const anchorTop = anchor.y;
      const anchorBottom = anchor.y + 40; // Höhe des Anchors

      const isColliding =
          birdRight > anchorLeft &&
          birdLeft < anchorRight &&
          birdBottom > anchorTop &&
          birdTop < anchorBottom;

      if (isColliding) {
        handleCollision();
      }

      // Erhöhe den Score, wenn ein Anchor passiert wird
      if (!passedAnchorsRef.current.has(anchor.id) && birdBottom > anchorBottom) {
        passedAnchorsRef.current.add(anchor.id);
        setScore((prev) => prev + 1);
      }
    });

    // Check for collision with torpedoes
    torpedoes.forEach((torpedo) => {
      const torpedoLeft = torpedo.x;
      const torpedoRight = torpedo.x + torpedoWidth;
      const torpedoTop = torpedo.y;
      const torpedoBottom = torpedo.y + torpedoHeight;

      const isColliding =
          birdRight > torpedoLeft &&
          birdLeft < torpedoRight &&
          birdBottom > torpedoTop &&
          birdTop < torpedoBottom;

      if (isColliding) {
        handleCollision();
      }

      // Increment score for passed torpedoes
      if (!passedTorpedoesRef.current.has(torpedo.id) && birdRight > torpedoRight) {
        passedTorpedoesRef.current.add(torpedo.id);
        setScore((prev) => prev + 1);
      }
    });
  };
  useEffect(() => {
    // Generiere alle 5 Sekunden einen Bonus
    const bonusGenerator = setInterval(() => {
      if (!gameOverRef.current && gameStartedRef.current) {
        const bonusX = Math.floor(Math.random() * (screenWidth - bonusWidth)); // Zufälliger X-Wert
        const bonusId = Math.random().toString(36).substring(2, 15); // Eindeutige Bonus-ID

        setBonuses((prev) => [
          ...prev,
          { x: bonusX, y: 800, id: bonusId }, // Bonus startet am unteren Rand
        ]);
      }
    }, BONUS_FREQUENCY); // Jede 5 Sekunden
    return () => clearInterval(bonusGenerator);
  }, []);

  useEffect(() => {
    gameStartedRef.current = gameStarted;
    gameOverRef.current = gameOver;
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameOver) {
      checkCollision();
    }
  }, [birdPosition, fishes, torpedoes, whaleSharks, jellyFishes]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameOverRef.current && gameStartedRef.current) {
        // Horizontale Geschwindigkeitsabbremsung
        setHorizontalVelocity((prevVelocity) => {
          if (prevVelocity > 0) return Math.max(prevVelocity - 0.1, 0);
          if (prevVelocity < 0) return Math.min(prevVelocity + 0.1, 0);
          return 0;
        });
        // Apply gravity and update bird position
        setVelocity((prevVelocity) =>
            Math.min(prevVelocity + gravity, terminalVelocity)
        );

        setBirdPosition((prev) => ({
          ...prev,
          x: Math.min(Math.max(prev.x + horizontalVelocity, 0), screenWidth - 50), // Restriktion für Bildschirmgrenzen
          y: Math.max(prev.y + velocity, 0), // Verhindern, dass der Vogel aus dem oberen Bereich herausfliegt
        }));

        // Fishes bewegen
        setFishes((prevFishes) =>
            prevFishes
            .map((fish) => ({ ...fish, x: fish.x - fishSpeed })) // Fishes bewegen mit dynamischer Geschwindigkeit
            .filter((fish) => fish.x + fishWidth > 0) // Entferne Fishes, die aus dem Bildschirm verschwinden
        );

        setAnchors((prevAnchors) =>
            prevAnchors
            .map((anchor) => ({
              ...anchor,
              y: anchor.y + anchor.speed, // Bewegung nach unten
              speed: anchor.speed + anchor.acceleration, // Geschwindigkeit erhöht sich durch Beschleunigung
            }))
            .filter((anchor) => anchor.y < 800) // Entferne Anchors, die aus dem Bildschirm unten verschwinden
        );

        // Torpedoes bewegen
        setTorpedoes((prevTorpedoes) =>
            prevTorpedoes
            .map((torpedo) => ({ ...torpedo, x: torpedo.x - torpedoSpeed })) // Torpedoes bewegen mit dynamischer Geschwindigkeit
            .filter((torpedo) => torpedo.x + torpedoWidth > 0) // Entferne Torpedoes, die aus dem Bildschirm verschwinden
        );

        // whalesharks bewegen
        setWhalesharks((prevWhaleSharks) =>
            prevWhaleSharks
            .map((whaleShark) => ({ ...whaleShark, x: whaleShark.x - whaleSharkSpeed })) // whaleshark bewegen mit dynamischer Geschwindigkeit
            .filter((whaleShark) => whaleShark.x + whaleSharkWidth > 0) // Entferne whaleshark, die aus dem Bildschirm verschwinden
        );

        // jellyFishes bewegen
        setJellyFishes((prevJellyFish) =>
            prevJellyFish
            .map((jellyFish) => ({ ...jellyFish, x: jellyFish.x - jellyFishSpeed, y: jellyFish.y - ((jellyFish.y - birdPosition.y) * JELLYFISH_TRACK) })) // jellyFish bewegen mit dynamischer Geschwindigkeit
            .filter((jellyFish) => jellyFish.x + jellyFishWidth > 0) // Entferne jellyFish, die aus dem Bildschirm verschwinden
        );

        // Innerhalb der gameLoop
        setBonuses((prevBonuses) =>
            prevBonuses
            .map((bonus) => ({ ...bonus, y: bonus.y - 5 })) // Bewegt Bonus nach oben
            .filter((bonus) => bonus.y + bonusHeight > 0) // Entferne Boni, wenn sie den Bildschirm verlassen
        );

        // Sea Urchins bewegen
        setSeaUrchins((prevSeaUrchins) =>
            prevSeaUrchins
            .map((seaUrchin) => {
              const randomVerticalMovement = (Math.random() - 0.5) * seaUrchin.verticalRange; // Zufällige vertikale Bewegung
              const newY = Math.max(0, Math.min(600, seaUrchin.y + randomVerticalMovement)); // Begrenzt auf Spielfeldhöhe

              return {
                ...seaUrchin,
                x: seaUrchin.x - seaUrchin.speed, // Horizontale Bewegung
                y: newY, // Vertikale Bewegung
              };
            })
            .filter((seaUrchin) => seaUrchin.x > -50) // Entferne ausserhalb des Screens befindliche Sea Urchins
        );
      }
    }, 30);

    return () => {
      clearInterval(gameLoop);
    };
  }, [velocity]);

  useEffect(() => {
    let anchorGenerator: number;
    const config = levelConfigs.find((lc) => lc.level === level) || levelConfigs[levelConfigs.length - 1];

    if (!gameOver && gameStarted && config.mobTypes.includes("Anchor")) {
      anchorGenerator = setInterval(() => {
        const anchorX = Math.floor(Math.random() * 800); // Zufällige X-Startposition
        const anchorId = Math.random().toString(36).substring(2, 15); // Eindeutige ID

        setAnchors((prev) => [
          ...prev,
          {
            x: anchorX, // Horizontale Position
            y: -50, // Startet oberhalb des Bildschirms
            speed: config.anchorConfig.initialSpeed,
            acceleration: config.anchorConfig.acceleration,
            id: anchorId,
          },
        ]);
      }, config.anchorConfig.frequency);
    }

    return () => clearInterval(anchorGenerator); // Spawner stoppen, wenn Level oder Zustand sich ändern
  }, [level, gameOver, gameStarted]);

  useEffect(() => {
    let fishGenerator: number;

    const generateFish = () => {
      const config = levelConfigs.find((lc) => lc.level === level) || levelConfigs[levelConfigs.length - 1];
      console.log('less mobs active: ', lessMobsActive)
      if (!gameOver && gameStarted && lessMobsActiveRef.current === false && config.mobTypes.includes("Fish")) {
        const fishY = Math.floor(Math.random() * 500);
        const fishId = Math.random().toString(36).substring(2, 15); // Eindeutige ID

        const fishImages = ["fish_violet.png", "red_fish.png", "fish_yellow.png"]; // Array mit verfügbaren Fischbildern
        const fishImage = fishImages[Math.floor(Math.random() * fishImages.length)];

        // Fisch hinzufügen
        setFishes((prev) => [
          ...prev,
          { x: spawnX, y: fishY, id: fishId, image: fishImage }, // Fisch-Objekt
        ]);

        // Zufälliges Zeitintervall für den nächsten Fisch zwischen 1-2 Sekunden
        const randomInterval = Math.random() * 4000 + 1000;

        // Starte das nächste Timeout erst, nachdem dieser Fisch generiert wurde
        fishGenerator = setTimeout(generateFish, randomInterval);
      }
    };

    if (!gameOver && gameStarted) {
      // Beginne mit dem ersten Fisch
      const initialDelay = Math.random() * 1000 + 1000; // Anfangsverzögerung ebenfalls zufällig setzen
      fishGenerator = setTimeout(generateFish, initialDelay);
    }

    return () => {
      clearTimeout(fishGenerator); // Stelle sicher, dass das Timeout beim Spielende/Neustart gelöscht wird
    };
  }, [level, gameOver, gameStarted]);

  useEffect(() => {
    let seaUrchinGenerator: number;
    const config = levelConfigs.find((lc) => lc.level === level) || levelConfigs[levelConfigs.length - 1];

    if (!gameOver && gameStarted && config.mobTypes.includes("SeaUrchin")) {
      seaUrchinGenerator = setInterval(() => {
        const seaUrchinY = Math.floor(Math.random() * 500); // Zufällige Startposition auf der Y-Achse
        const seaUrchinId = Math.random().toString(36).substring(2, 15); // Eindeutige ID

        setSeaUrchins((prev) => [
          ...prev,
          {
            x: spawnX, // Sea Urchin startet rechts außerhalb des Bildschirms
            y: seaUrchinY,
            id: seaUrchinId,
            speed: config.seaUrchinConfig.speed,
            verticalRange: config.seaUrchinConfig.verticalRange, // Vertikaler Bewegungsbereich
          },
        ]);
      }, config.seaUrchinConfig.frequency);
    }

    return () => clearInterval(seaUrchinGenerator); // Spawner stoppen, wenn Spiel endet oder pausiert
  }, [level, gameOver, gameStarted]);

  useEffect(() => {
    let jellyFishGenerator: number;
    const config = levelConfigs.find((lc) => lc.level === level) || levelConfigs[levelConfigs.length - 1];

    // Überprüfe, ob in diesem Level Jellyfish aktiviert sind
    if (!gameOver && gameStarted && config.mobTypes.includes("Jellyfish")) {
      jellyFishGenerator = setInterval(() => {
        const jellyFishY = Math.floor(Math.random() * 600); // Random position
        const jellyFishId = Math.random().toString(36).substring(2, 15); // Unique jellyfish id
        setJellyFishes((prev) => [
          ...prev,
          { x: spawnX, y: jellyFishY, id: jellyFishId }, // jellyfish properties
        ]);
      }, config.jellyfishConfig.frequency); // Frequenz angepasst an Level
    }

    return () => {
      clearInterval(jellyFishGenerator); // Generator stoppen, wenn Level oder Spielzustand sich ändern
    };
  }, [level, gameOver, gameStarted]);

  useEffect(() => {
    let whaleSharkGenerator: number;
    const config = levelConfigs.find((lc) => lc.level === level) || levelConfigs[levelConfigs.length - 1];
    if (!gameOver && gameStarted && lessMobsActiveRef.current == false && config.mobTypes.includes("WhaleShark")) {
      const startWhaleSharkAfterDelay = window.setTimeout(() => { //

        whaleSharkGenerator = setInterval(() => {
          const whaleSharkY = Math.floor(Math.random() * 600); // Random position
          const whaleSharkId = Math.random().toString(36).substring(2, 15); // Unique whaleShark id
          setWhalesharks((prev) => [
            ...prev,
            { x: spawnX, y: whaleSharkY, id: whaleSharkId }, // whaleshark properties
          ]);
        }, 10000); // Alle 2 Sekunden Pipes hinzufügen
      }, 500); // whaleshark-Generierung startet nach 10 Sekunden

      return () => {
        // Timer und Intervall bereinigen (falls aktiv)
        window.clearTimeout(startWhaleSharkAfterDelay); // Den Timeout löschen
        window.clearInterval(whaleSharkGenerator); // Den Intervall löschen
      };
    }
  }, [level, gameOver, gameStarted]); // Überwache Änderungen von `gameOver` und `gameStarted`

  useEffect(() => {
    let torpedoGenerator: number;
    const config = levelConfigs.find((lc) => lc.level === level) || levelConfigs[levelConfigs.length - 1];
    if (!gameOver && gameStarted && lessMobsActiveRef.current == false && config.mobTypes.includes("Torpedo")) {
      const startTorpedosAfterDelay = window.setTimeout(() => { //

    torpedoGenerator = setInterval(() => {
        const torpedoY = Math.floor(Math.random() * 600); // Random position
        const torpedoId = Math.random().toString(36).substring(2, 15); // Unique torpedo id
        setTorpedoes((prev) => [
          ...prev,
          { x: spawnX, y: torpedoY, id: torpedoId }, // Torpedo properties
        ]);
      }, 4000); // Alle 2 Sekunden Pipes hinzufügen
    }, 10000); // Pipe-Generierung startet nach 10 Sekunden

        return () => {
          // Timer und Intervall bereinigen (falls aktiv)
          window.clearTimeout(startTorpedosAfterDelay); // Den Timeout löschen
          window.clearInterval(torpedoGenerator); // Den Intervall löschen
        };
      }
    }, [level, gameOver, gameStarted]); // Überwache Änderungen von `gameOver` und `gameStarted`

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameOver && gameStarted) {
        if (e.key === "a") {
          // Links beschleunigen
          setHorizontalVelocity((prev) => Math.max(prev - 1, -5)); // Geschwindigkeitsbegrenzung nach links (-5)
        } else if (e.key === "d") {
          // Rechts beschleunigen
          setHorizontalVelocity((prev) => Math.min(prev + 1, 5)); // Geschwindigkeitsbegrenzung nach rechts (+5)
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, gameOver]);
  return (
      <div className={`App ${gameOver ? "game-over" : ""}`} onClick={jump}>
        <Bird birdPosition={birdPosition} isVisible={isVisible}/>
        {fishes.map((fish) => (
            <Fish
                key={fish.id}
                fishPosition={fish}
            />
        ))}
        {whaleSharks.map((whaleShark) => (
            <WhaleShark key={whaleShark.id} whaelSharkPosition={whaleShark} />
        ))}
        {jellyFishes.map((jellyFish) => (
            <Jellyfish key={jellyFish.id} jellyFishPosition={jellyFish} />
        ))}
        {torpedoes.map((torpedo) => (
            <Torpedos key={torpedo.id} torpedoPosition={torpedo} />
        ))}
        {seaUrchins.map((seaUrchin) => (
            <SeaUrchin
                key={seaUrchin.id}
                seaUrchinPosition={seaUrchin}
            />
        ))}
        {anchors.map((anchor) => (
            <Anchor
                key={anchor.id}
                anchorPosition={anchor}
            />
        ))}

        {anchors.map((anchor) => (
            <div
                key={anchor.id}
                style={{
                  position: "absolute",
                  top: `${anchor.y}px`,
                  left: `${anchor.x}px`,
                  width: "40px",
                  height: "40px",
                  background: "url('/images/anchor.png') no-repeat center",
                  backgroundSize: "contain",
                }}
            ></div>
        ))}
        {bonuses.map((bonus) => (
            <Bonus key={bonus.id} bonusPosition={bonus} />
        ))}
        {/* Level-Anzeige */}
        {!gameOver && (
            <div
                style={{
                  position: "absolute",
                  top: 50,
                  right: 20,
                  fontSize: "16px",
                  padding: "5px 10px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  borderRadius: "5px",
                }}
            >
              Level: {level}
            </div>
        )}

        {showLevelIndicator && (
            <div
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  color: "black",
                  fontSize: "24px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  zIndex: 1000,
                }}
            >
              Level {level}!
            </div>
        )}
        {slowerEffectActive && (
            <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  color: "yellow",
                  fontWeight: "bold",
                }}
            >
              Slow Mode Active!
            </div>
        )}
        {lessMobsActive && (
            <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  color: "yellow",
                  fontWeight: "bold",
                }}
            >
              Less Mobs Mode Active!
            </div>
        )}
        {isInvincible && (
            <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  color: "yellow",
                  fontWeight: "bold",
                }}
            >
              Invicible Mode Active!
            </div>
        )}
        {!gameOver && (
            <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  zIndex: 1000
                }}
            >
              <div
                  style={{
                    marginRight: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
              >
                {lives > 0 && [...Array(lives)].map((_, index) => (
                    <Heart key={index} />
                ))}
              </div>
              <div
                  style={{
                    fontSize: "14px",
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
              >
                Score: {score}
              </div>
            </div>
        )}
        {!gameStarted && !gameOver &&(
            <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "linear-gradient(120deg, #87CEFA, #4682B4, #1E90FF)", // Blautöne
                  backgroundSize: "300% 300%", // Für sanfte Gradient-Animation
                  animation: "gradientMoveBlue 8s ease infinite", // Animierter Gradient
                  color: "white",
                  fontSize: "24px",
                  fontWeight: "bold",
                  zIndex: 1000,
                }}
            >
              <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    borderRadius: "15px",
                    backgroundColor: "rgba(0, 0, 64, 0.7)", // Halbtransparenter dunklerer Blauton für den Hintergrund des Textes
                    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)", // Leichter Schatteneffekt
                    backdropFilter: "blur(10px)", // Weichzeichnereffekt
                    color: "white",
                  }}
              >
                <div
                    style={{
                      animation: "pulseBlue 1.5s infinite", // Animation für Text
                    }}
                >
                  <p style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>
                    Click anywhere to start!
                  </p>
                </div>
                <p style={{ fontSize: "18px", color: "rgba(240, 248, 255, 0.85)" }}>
                  Control:
                  <br />
                  <b>[A]</b> and <b>[D]</b>, to move horizontally
                  <br />
                  <b>Left Mouse</b>, to jump
                </p>
              </div>
            </div>
        )}
        {gameOver && (
            <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(139, 0, 0, 0.8)", // Dunkelrot mit Transparenz
                  zIndex: 1000,
                  color: "white",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
            >
              <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    borderRadius: "15px",
                    backgroundColor: "rgba(64, 0, 0, 0.9)", // Noch dunkleres Rot für die Box
                    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.4)", // Leichter Schatten
                    color: "white",
                  }}
              >
                <div
                    style={{
                      animation: "pulseRed 1.5s infinite", // Pulsierende Animation für den "Game Over!"-Text
                    }}
                >
                  <p style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "20px" }}>
                    Game Over!
                  </p>
                </div>
                <p
                    style={{
                      fontSize: "18px",
                      backgroundColor: "rgba(255, 255, 255, 0.8)", // Heller Hintergrund für Score
                      color: "black",
                      padding: "10px 20px",
                      borderRadius: "5px",
                    }}
                >
                  Final Score: {score}
                </p>
                <p
                    style={{
                      marginTop: "15px",
                      fontSize: "16px",
                      color: "rgba(255, 182, 193, 0.9)", // Hellrot für Hinweistexte
                    }}
                >
                  Click anywhere to restart!
                </p>
              </div>
            </div>
        )}
        <div className="ground"></div> {/* Hinzugefügt */}
      </div>

  );
};

export default SDMANAGER;
