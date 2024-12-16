import React, { useState, useEffect } from "react";
import { Timer, Award, PlusCircle, Play, Volume2, VolumeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GameInterface = () => {
    const [timeRemaining, setTimeRemaining] = useState(15);
    const [currentTeams, setCurrentTeams] = useState({
        team1: { name: "", score: 0 },
        team2: { name: "", score: 0 },
    });
    const [allTeams, setAllTeams] = useState([]);
    const [isGameActive, setIsGameActive] = useState(false);
    const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState("");

    const startGame = () => {
        if (!currentTeams.team1.name || !currentTeams.team2.name) {
            alert("Silakan pilih kedua tim terlebih dahulu!");
            return;
        }
        setTimeRemaining(15);
        setIsGameActive(true);
    };

    const addPoint = (team) => {
        if (!isGameActive) return;
        
        setCurrentTeams((prev) => ({
            ...prev,
            [team]: {
                ...prev[team],
                score: prev[team].score + 1,
            },
        }));

        setAllTeams((prevTeams) => 
            prevTeams.map((t) => 
                t.name === currentTeams[team].name 
                    ? { ...t, score: t.score + 1 } 
                    : t
            )
        );
    };

    const addNewTeam = () => {
        setIsAddTeamModalOpen(true);
    };

    const confirmAddTeam = () => {
        const trimmedName = newTeamName.trim();
        if (trimmedName) {
            const teamExists = allTeams.some((team) => team.name === trimmedName);

            if (teamExists) {
                alert("Nama tim sudah ada. Pilih nama lain.");
                return;
            }

            if (allTeams.length < 16) {
                setAllTeams((prev) => [...prev, { name: trimmedName, score: 0 }]);
                setIsAddTeamModalOpen(false);
                setNewTeamName("");
            } else {
                alert("Maksimal tim telah tercapai!");
            }
        } else {
            alert("Nama tim tidak boleh kosong!");
        }
    };

    const selectTeamForGame = (teamName, position) => {
        if (!["team1", "team2"].includes(position)) return;

        const selectedTeam = allTeams.find((team) => team.name === teamName);
        if (selectedTeam) {
            setCurrentTeams((prev) => ({
                ...prev,
                [position]: { ...selectedTeam, score: 0 },
            }));
        }
    };

    const resetGame = () => {
        setCurrentTeams({
            team1: { name: "", score: 0 },
            team2: { name: "", score: 0 },
        });
        setIsGameActive(false);
        setTimeRemaining(15);
    };

    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        let interval;
        if (isGameActive && timeRemaining > 0 && !isPaused) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            setIsGameActive(false);
        }
        return () => clearInterval(interval);
    }, [isGameActive, timeRemaining, isPaused]);

    const toggleTimer = () => {
        setIsPaused((prev) => !prev);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isGameActive) {
                if (event.key === "a" || event.key === "A") {
                    addPoint("team1");
                } else if (event.key === "l" || event.key === "L") {
                    addPoint("team2");
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isGameActive]);

    const [musicList] = useState([
        { id: 1, name: "Lagu 1", src: "/sound/fruit.mp3" },
        { id: 2, name: "Lagu 2", src: "/sound/hill.mp3" },
        { id: 3, name: "Lagu 3", src: "/sound/pou.mp3" },
        { id: 4, name: "Lagu 4", src: "/sound/ss.mp3" },
    ]);
    const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = React.useRef(new Audio());

    const playRandomMusic = () => {
        const audio = audioRef.current;
    
        if (isMusicPlaying) {
            audio.pause();
            setIsMusicPlaying(false);
        } else {
            const randomIndex = () => {
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * musicList.length);
                } while (newIndex === currentMusicIndex);
                return newIndex;
            };
    
            const nextIndex = randomIndex();
            setCurrentMusicIndex(nextIndex);
    
            audio.src = musicList[nextIndex].src;
            audio.play();
            setIsMusicPlaying(true);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => {
            setIsMusicPlaying(false);
            if (isMusicPlaying) {
                const nextIndex = (currentMusicIndex + 1) % musicList.length;
                setCurrentMusicIndex(nextIndex);
                audio.src = musicList[nextIndex].src;
                audio.play();
            }
        };
        audio.addEventListener("ended", handleEnded);
        return () => {
            audio.removeEventListener("ended", handleEnded);
        };
    }, [currentMusicIndex, isMusicPlaying]);

    return (
        <div className="w-full flex flex-col items-center bg-gray-900 text-gray-100 min-h-screen pt-10 px-5 lg:px-0">
            <button onClick={playRandomMusic} className="p-2 rounded-full text-white border-2 absolute bottom-6 right-3">
                {isMusicPlaying ? <Volume2 className="w-5"/> : <VolumeOff className="w-5"/>}
            </button>
            <div className="flex lg:justify-center justify-between space-x-2 lg:space-x-4 w-full">
            {/* Tim Kiri */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md basis w-1/4 flex flex-col items-center">
                    <h3 className="font-semibold text-sm text-center lg:text-xl">
                        {currentTeams.team1.name || "KELOMPOK 1"}
                    </h3>
                    <div className="lg:text-9xl text-5xl font-bold">
                        {currentTeams.team1.score}
                    </div>
                </div>

                {/* Timer di Tengah */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md w-1/2 lg:w-1/4 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Timer className="mr-2" />
                        <h2 className="text-xl font-bold">Timer</h2>
                    </div>
                    <div
                        className={`text-4xl font-bold ${
                            timeRemaining <= 10 && timeRemaining % 2 === 0
                                ? "text-red-500"
                                : "text-gray-200"
                        }`}
                    >
                        <span>{Math.floor(timeRemaining / 60)}</span>:
                        <span>
                            {(timeRemaining % 60).toString().padStart(2, "0")}
                        </span>
                    </div>

                    {!isGameActive && (
                        <div className="flex justify-between gap-2">
                            <button
                                onClick={startGame}
                                className="mt-4 w-full bg-green-500 text-white py-2 rounded"
                                disabled={
                                    !currentTeams.team1.name ||
                                    !currentTeams.team2.name
                                }
                            >
                                Mulai Permainan
                            </button>
                            <button
                                onClick={resetGame}
                                className={`mt-4 w-full bg-yellow-500 text-white py-2 rounded ${
                                    !currentTeams.team1.name &&
                                    !currentTeams.team2.name &&
                                    "hidden"
                                }`}
                            >
                                Ubah Kelompok
                            </button>
                        </div>
                    )}
                    {isGameActive && (
                        <div className="flex gap-5">
                            <button
                                onClick={resetGame}
                                className="mt-4 w-full bg-red-500 text-white py-2 rounded"
                            >
                                Reset
                            </button>
                            <button
                                onClick={toggleTimer}
                                className="mt-4 w-full bg-yellow-500 text-white py-2 rounded"
                            >
                                {isPaused ? "Lanjut" : "Pause"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Tim Kanan */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md w-1/4 flex flex-col items-center">
                    <h3 className="font-semibold text-sm text-center lg:text-xl">
                        {currentTeams.team2.name || "KELOMPOK 2"}
                    </h3>
                    <div className="lg:text-9xl text-5xl font-bold">
                        {currentTeams.team2.score}
                    </div>
                </div>
            </div>

            {/* Kolom Peringkat Tim */}
            <div className="mt-8 bg-gray-800 p-4 rounded-lg shadow-md lg:w-1/3 w-3/4">
                <span className="flex items-center justify-between">
                    <h2 className="lg:text-xl text-lg font-bold flex items-center">
                        <Award className="lg:mr-2"/> Peringkat Kelompok
                    </h2>
                    <PlusCircle
                        className="text-green-500 cursor-pointer"
                        onClick={addNewTeam}
                        size={20}
                    />
                </span>
                <div className="flex justify-between items-center lg:mb-4 mb-10">
                </div>
                <AnimatePresence>
                    {allTeams
                        .sort((a, b) => b.score - a.score)
                        .map((team) => (
                            <motion.div
                                key={team.name}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                className="flex justify-between items-center mb-2 p-2 rounded bg-gray-700"
                            >
                                <span>{team.name}</span>
                                <div className="flex items-center space-x-2">
                                    <Play
                                        className={`cursor-pointer ${
                                            currentTeams.team1.name ===
                                                team.name ||
                                            currentTeams.team2.name ===
                                                team.name
                                                ? "text-green-500"
                                                : "text-gray-400"
                                        }`}
                                        onClick={() => {
                                            if (
                                                currentTeams.team1.name ===
                                                    "" ||
                                                currentTeams.team1.name ===
                                                    team.name
                                            ) {
                                                selectTeamForGame(
                                                    team.name,
                                                    "team1"
                                                );
                                            } else if (
                                                currentTeams.team2.name ===
                                                    "" ||
                                                currentTeams.team2.name ===
                                                    team.name
                                            ) {
                                                selectTeamForGame(
                                                    team.name,
                                                    "team2"
                                                );
                                            }
                                        }}
                                    />
                                    <span className="mr-2 font-bold">
                                        {team.score}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                </AnimatePresence>
            </div>

            {/* Modal Tambah Tim */}
            {isAddTeamModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-gray-100 lg:w-1/4 w-3/4">
                        <h2 className="text-xl font-bold mb-4">
                            Tambah Tim Baru
                        </h2>
                        <input
                            type="text"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            placeholder="Masukkan nama Kelompok"
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md mb-4 text-gray-100"
                        />
                        <div className="flex justify-between space-x-2">
                            <button
                                onClick={() => setIsAddTeamModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 text-gray-100 rounded-md"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmAddTeam}
                                className="px-4 py-2 bg-green-500 text-white rounded-md"
                            >
                                Tambah
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameInterface;