import React, { useEffect, useState } from 'react';
import './animation.styles.css';

import { IconContext } from 'react-icons';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const storeLikedAnimation = (username, link) => {
    (async() => {
        await fetch('http://localhost:8080/animation-list', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                link
            })
        });
    })();
}

async function getLikedAnimations(username) { 
    const res = await fetch(`http://localhost:8080/animation-list/?username=${username}`); 
    const json = await res.json();
    const likedAnimations = json.animationList;

    return likedAnimations;
}

// eslint-disable-next-line react/prop-types
const Animation = ({ name, gif, description, link }) => {
    // state se updatuje, ali useState radi asinhrono pa nailazimo na problem gde nece da se updatuje dok se ne refreshuje stranica
    const [likedAnimations, setLikedAnimations] = useState([]);

    async function getUsernameAndAnimations(url) { 
        const res = await fetch(url); 
        const json = await res.json();
        const username = json.username;
        const likedAnimations = json.likedAnimations;

        return {
            username,
            likedAnimations
        };
    } 

    if(!sessionStorage.getItem('username')) {
        getUsernameAndAnimations('http://localhost:8080/login/send-data-to-frontend').then(data => {
            sessionStorage.setItem('username', data.username);
            setLikedAnimations(data.likedAnimations);
        });
        // daje prazan niz cak i kad korisnik ima lajkovane animacije
        console.log("Start animacije", likedAnimations);
    } 

    useEffect(() => {
        getUsernameAndAnimations('http://localhost:8080/login/send-data-to-frontend').then(data => {
            setLikedAnimations(data.likedAnimations);
        });
    }, []);

    return (
        <div className='block'>
            <div className='naslov-link'>
                <h3>{name}</h3>
                <span className='animation-link-header'>
                    <a 
                        href={link || 'https://www.google.rs/'} 
                        className='animation-link'
                    >
                        Visit
                    </a>
                </span>
            </div>  
            <img src={gif} alt={name}/>
            <div style={{
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between'
                }}
            >
                <p>{description}</p> 
                {sessionStorage.getItem('username') ?
                    <IconContext.Provider 
                        value={{ color: 'red', size: 34 }}
                    >
                        <div className='like-btn' onClick={() => {
                            storeLikedAnimation(sessionStorage.getItem('username'), link);
                            getLikedAnimations(sessionStorage.getItem('username')).then(animations => {
                                setLikedAnimations(animations);
                                console.log(animations);
                                console.log("State:", likedAnimations);
                            });
                        }}>
                            {likedAnimations.indexOf(link) !== -1 ? <AiFillHeart/> : <AiOutlineHeart/>}
                        </div>
                    </IconContext.Provider> : null}
            </div>     
        </div>
    );
}

export default Animation;