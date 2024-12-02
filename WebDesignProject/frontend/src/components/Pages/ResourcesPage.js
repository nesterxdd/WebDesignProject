import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Resources() {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5054/api/resources')
            .then(response => setResources(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Resources Page</h1>
            <ul>
                {resources.map(resource => (
                    <li key={resource.id}>{resource.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Resources;
