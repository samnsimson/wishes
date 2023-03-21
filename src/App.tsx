import { useEffect, useState } from "react";
import confetti, { CreateTypes } from "canvas-confetti";
import "./App.css";
import { useWindowSize } from "usehooks-ts";
import useSound from "use-sound";
import { PlayFunction } from "use-sound/dist/types";
import { isMobile } from "react-device-detect";

function App() {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [showText, setShowText] = useState(false);
    const { width, height } = useWindowSize();
    const duration = 15 * 1000;
    const defaultsFireWorks = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const defaultsStars = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
    };
    const [playSoundOne, { stop: stopSoundOne }] = useSound("https://fireworks.js.org/sounds/explosion0.mp3");
    const [playSoundTwo, { stop: stopSoundTwo }] = useSound("https://fireworks.js.org/sounds/explosion1.mp3");
    const [playSoundThree, { stop: stopSoundThree }] = useSound("https://fireworks.js.org/sounds/explosion2.mp3");
    const sounds = [playSoundOne, playSoundTwo, playSoundThree];

    const pickRandomItem = (items: PlayFunction[]) => {
        return items[Math.floor(Math.random() * items.length)];
    };

    const fireWorks = (confetti: CreateTypes) => {
        const endTime = Date.now() + duration;
        let interval = setInterval(() => {
            let timeLeft = endTime - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            var particleCount = 500 * (timeLeft / duration);
            pickRandomItem(sounds)();
            confetti(
                Object.assign({}, defaultsFireWorks, {
                    particleCount,
                    origin: {
                        x: Math.random(),
                        y: Math.random() - 0.2,
                    },
                })
            )?.then(() => {
                stopSoundOne();
                stopSoundTwo();
                stopSoundThree();
                confetti.reset();
                setShowText(false);
            });
        }, 100);
    };

    const shoot = (confetti: CreateTypes) => {
        confetti({
            ...defaultsStars,
            particleCount: 40,
            scalar: 1.2,
            shapes: ["star"],
        });
        confetti({
            ...defaultsStars,
            particleCount: 10,
            scalar: 0.75,
            shapes: ["circle"],
        });
    };

    const showConfetti = (canvas: HTMLCanvasElement | null) => {
        if (canvas) {
            const myConfetti = confetti.create(canvas, { resize: true });
            setShowText(true);
            fireWorks(myConfetti);
            shoot(myConfetti);
            setTimeout(() => shoot(myConfetti), 3750);
            setTimeout(() => shoot(myConfetti), 7500);
            setTimeout(() => shoot(myConfetti), 11250);
            setTimeout(() => shoot(myConfetti), 15000);
        }
    };

    useEffect(() => {
        if (!canvas && width && height) {
            console.log("No canvas");
            const newCanvas = document.createElement("canvas");
            newCanvas.width = width;
            newCanvas.height = height;
            document.body.appendChild(newCanvas);
            setCanvas(document.querySelector("canvas"));
        }
    }, [canvas, width, height]);

    if (isMobile) {
        return <p className="text-white">Please open the link in a desktop browser</p>;
    }

    return (
        <div className="flex h-[100vh] w-full items-center justify-center font-poppins absolute top-0 left-0">
            {showText ? (
                <div className="text-center">
                    <span className="text-[94px]">🎉 🎂</span>
                    <h1 className="text-[94px] text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                        Poda kena <br />
                        kundan
                    </h1>
                </div>
            ) : (
                <button
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 font-black text-2xl rounded shadow-lg text-white uppercase"
                    onClick={() => showConfetti(canvas)}
                >
                    click me 🤞
                </button>
            )}
        </div>
    );
}

export default App;
