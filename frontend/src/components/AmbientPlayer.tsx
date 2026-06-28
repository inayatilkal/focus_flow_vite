import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Waves, TreePine } from 'lucide-react';

const sounds = [
  { name: 'Rain', url: './src/sounds/rain.mp3', icon: <CloudRain size={32} />, description: 'The gentle sound of falling rain, perfect for focus and relaxation.' },
  { name: 'Ocean Waves', url: './src/sounds/ocean-waves.mp3', icon: <Waves size={32} />, description: 'The rhythmic crashing of ocean waves, ideal for a calming atmosphere.' },
  { name: 'Forest', url: './src/sounds/forest.mp3', icon: <TreePine size={32} />, description: 'The peaceful ambiance of a forest, with birds chirping and leaves rustling.' },
];

export default function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSound, setSelectedSound] = useState(sounds[0].url);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSound, setHoveredSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play / Pause toggle
  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch {
      setError(
        'Playback blocked. Please click the Play button again or allow sound from this site in your browser settings.'
      );
    }
  };

  // Handle when user selects a new sound
  const handleSoundChange = (newSound: string) => {
    setSelectedSound(newSound);
    setError(null);

    // Stop the current sound and reset player
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = newSound;
      audioRef.current.load();
    }

    // Reset state — require manual replay
    setIsPlaying(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Ambient Sounds</h2>
      <p className="text-gray-600 mb-3 text-sm">Select a sound and press play for a calming background.</p>

      <div className="mb-3">
        <label className="block text-gray-700 font-bold mb-2 text-sm">
          Choose a sound:
        </label>
        <div className="grid grid-cols-3 gap-2">
            {sounds.map((sound) => (
                <div
                    key={sound.name}
                    onClick={() => handleSoundChange(sound.url)}
                    onMouseEnter={() => setHoveredSound(sound.name)}
                    onMouseLeave={() => setHoveredSound(null)}
                    className={`relative cursor-pointer rounded-lg p-2 flex flex-col items-center justify-center transition-all ${
                        selectedSound === sound.url ? 'bg-green-200 ring-2 ring-green-500' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    {sound.icon}
                    <p className="text-center text-xs font-medium text-gray-800 mt-1">{sound.name}</p>
                    {hoveredSound === sound.name && (
                        <div 
                            className="absolute bottom-full mb-2 w-max max-w-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-lg py-2 px-4 shadow-xl z-10"
                            style={{ left: '50%', transform: 'translateX(-50%)' }}
                        >
                            {sound.description}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-blue-600"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      <audio
        ref={audioRef}
        loop
        src={selectedSound}
        onError={() =>
          setError('Error: Failed to load the audio file. The source may be unavailable.')
        }
      />

      <button
        onClick={togglePlay}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
          isPlaying
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-600 hover:bg-gray-700 text-white'
        }`}
      >
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        {isPlaying ? 'Stop Sound' : 'Play Sound'}
      </button>

      {error && (
        <div
          className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"

          role="alert"
        >
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
