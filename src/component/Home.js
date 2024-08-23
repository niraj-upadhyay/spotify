import React, { useState, useEffect, useRef } from "react";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef(null);
  const rangeRef = useRef(null); // Define rangeRef

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("https://cms.samespace.com/items/songs");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Fetch song duration
        const songsWithDuration = await Promise.all(
          (data.data || []).map(async (song) => {
            const duration = await getSongDuration(song.url);
            return { ...song, duration };
          })
        );

        setSongs(songsWithDuration);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const getSongDuration = (url) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
    });
  };

  useEffect(() => {
    if (currentSongIndex !== null && songs.length > 0) {
      const song = songs[currentSongIndex];
      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentTime(0); // Reset current time when changing song
        setDuration(song.duration || 0); // Set duration from selected song
      }
    }
  }, [currentSongIndex, songs]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const handleForward = () => {
    if (songs.length > 0) {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === null ? 0 : (prevIndex + 1) % songs.length
      );
    }
  };

  const handleBackward = () => {
    if (songs.length > 0) {
      setCurrentSongIndex((prevIndex) =>
        prevIndex === null ? 0 : (prevIndex - 1 + songs.length) % songs.length
      );
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // Define handleRangeChange function
  const handleRangeChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const currentSong = songs[currentSongIndex] || {};
  const filteredSongs = songs.filter((song) => {
    const query = searchQuery.toLowerCase();
    return (
      song.name.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
    );
  });

  const coverImageUrl = (coverId) => {
    return `https://cms.samespace.com/assets/${coverId}.jpg`;
  };

  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-4 mt-4 order-md-1 order-2 mb-4">
          {/* <h6 style={{ display: "inline-block", marginRight: "20px" }}>You</h6>
          <h6 style={{ display: "inline-block" }}>Top Track</h6> */}
          <input
            type="search"
            name="search"
            className="form-control"
            placeholder="Search song, artist"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {filteredSongs.length > 0 ? (
            <ul className="list-group mt-3">
              {filteredSongs.map((song, index) => (
                <li
                  key={song.id}
                  className="list-group-item song-list-item d-flex justify-content-between align-items-center"
                  onClick={() => handleSongSelect(index)}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        song.cover
                          ? coverImageUrl(song.cover)
                          : "default-image.jpg"
                      }
                      alt={song.name || "No Title"}
                      className="img-thumbnail"
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "15px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h6 className="mb-1">{song.name || "No Title"}</h6>
                      <small className="text-muted">
                        {song.artist || "Unknown Artist"}
                      </small>
                    </div>
                    {/*  */}
                  </div>
                  <span>{formatTime(song.duration) || "Unknown Duration"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No songs available</p>
          )}
        </div>
        <div className="col-md-4 mt-4 order-md-2 order-1 text-center">
          <div className="song">
            {currentSong && (
              <>
                <img
                  src={
                    currentSong.cover
                      ? coverImageUrl(currentSong.cover)
                      : songs.length > 0
                      ? coverImageUrl(songs[0].cover)
                      : "default-image.jpg"
                  }
                  alt={currentSong.name || "No Song Selected"}
                  className="img-fluid"
                  style={{
                    width: "100%",
                    height: "300px",
                    maxWidth: "300px",
                    marginTop: "40px",
                    border: "2px solid #000",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
                <div className="songname-overlay">
                  {currentSong.name || "No Song Selected"} <br />
                  {currentSong.artist || "Unknown Artist"}
                </div>
                <div className="controls mt-3">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={handleBackward}
                  >
                    <i className="bi bi-skip-backward-fill"></i>
                  </button>
                  <button
                    className="btn btn-secondary me-2"
                    onClick={handlePlayPause}
                  >
                    <i
                      className={`bi ${
                        isPlaying ? "bi-pause-fill" : "bi-play-fill"
                      }`}
                    ></i>
                  </button>
                  <button className="btn btn-secondary" onClick={handleForward}>
                    <i className="bi bi-skip-forward-fill"></i>
                  </button>
                </div>
                <div className="mt-5 range-container text-center">
                  <span className="range-time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <input
                    ref={rangeRef}
                    type="range"
                    className="range-slider mt-2"
                    min="0"
                    max={duration}
                    step="0.01"
                    value={currentTime}
                    onChange={handleRangeChange}
                    style={{
                      "--value": `${(currentTime / duration) * 100}%`,
                    }}
                  />
                </div>

                <div className="col-md-2"></div>
              </>
            )}
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleForward}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
