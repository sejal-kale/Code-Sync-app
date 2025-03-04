import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

const Home = () => {
    // navigating to the page
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id)
        console.log(id)
        toast.success('Created new Room')

    }

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('Please enter both room id and username')
            return;
        }
        navigate(`editor/${roomId}`, {
            state: {
                username: username
            }
        })


    }

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img
                    className="homePageLogo"
                    src="/code-sync.png"
                    alt="code-sync-logo"
                />
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}

                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}


                    />
                    <button className="btn joinBtn" onClick={joinRoom} >
                        Join
                    </button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            className="createNewBtn"
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>

            <footer>

                <h4>
                    Built by &nbsp;
                    <a href="https://github.com/sejal-kale">Sejal Kale</a>
                </h4>
            </footer>
        </div>

    );
};

export default Home;
