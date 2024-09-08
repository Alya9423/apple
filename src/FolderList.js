import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

const FolderList = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [folders, setFolders] = useState([]);
  const [detectors, setDetectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rastersByFolder, setRastersByFolder] = useState({});

  const apiKey = 'f8773ad8ac1b2964bbd054888667d03c4fd059b99f7a89ef590342676b87e89f';
  const rastersApiUrl = 'https://app.picterra.ch/public/api/v2/rasters/';
  
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchFolders();
    } else if (activeTab === 'detectors') {
      fetchDetectors();
    }
  }, [activeTab]);

  const fetchFolders = () => {
    setLoading(true);
    fetch('https://app.picterra.ch/public/api/v2/folders/', {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFolders(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching folders:', error);
        setLoading(false);
      });
  };

  const fetchDetectors = () => {
    setLoading(true);
    fetch('https://app.picterra.ch/public/api/v2/detectors/', {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDetectors(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching detectors:', error);
        setLoading(false);
      });
  };

  const toggleRastersForFolder = (folderId) => {
    if (rastersByFolder[folderId]) {
      setRastersByFolder((prevState) => ({
        ...prevState,
        [folderId]: prevState[folderId] ? null : prevState[folderId],
      }));
      return;
    }

    fetch(rastersApiUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const rasters = data.results.filter((raster) => raster.folder_id === folderId);
        setRastersByFolder((prevState) => ({
          ...prevState,
          [folderId]: rasters,
        }));
      })
      .catch((error) => console.error('Error fetching rasters data:', error));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Function to handle raster click and navigate
  const handleRasterClick = (rasterId) => {
    navigate(`/raster/${rasterId}`); // Use navigate to go to the raster page
  };

  return (
    <div className="container">
      <h1 className="my-4">Folder List</h1>

      {/* Tabs Navigation */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('projects');
            }}
          >
            Projects
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === 'detectors' ? 'active' : ''}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('detectors');
            }}
          >
            Detectors
          </a>
        </li>
      </ul>

      {/* Tabs Content */}
      <div className="mt-4">
        {loading && <p>Loading...</p>}

        {activeTab === 'projects' && !loading && (
          <div id="projects-content">
            {/* Display Folders */}
            {folders.length > 0 ? (
              <div className="row">
                {folders.map((folder) => (
                  <div key={folder.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div className="folder-card" onClick={() => toggleRastersForFolder(folder.id)}>
                      <i className="fas fa-folder folder-icon"></i>
                      <p className="folder-name">{folder.name}</p>

                      {/* Display rasters for the clicked folder */}
                      {rastersByFolder[folder.id] && (
                        <div className="rasters-list">
                          {rastersByFolder[folder.id].length > 0 ? (
                            rastersByFolder[folder.id].map((raster) => (
                              <div
                                key={raster.id}
                                className="raster-item"
                                onClick={() => handleRasterClick(raster.id)} // Navigate on click
                              >
                                <img
                                  src={raster.thumbnail || 'https://via.placeholder.com/50'}
                                  alt={raster.name || 'Unnamed Raster'}
                                  className="raster-image"
                                />
                                <div className="raster-details">
                                  <p className="raster-name">{raster.name || 'Unnamed Raster'}</p>
                                  <p className="raster-status">
                                    {new Date(raster.created_at).toLocaleDateString()} • {raster.area || '0 km²'} • {raster.resolution || 'N/A'} MP
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>No rasters found for this folder.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No folders found.</p>
            )}
          </div>
        )}

        {activeTab === 'detectors' && !loading && (
          <div id="detectors-content">
            {/* Display Detectors */}
            {detectors.length > 0 ? (
              <div className="list-group">
                {detectors.map((detector) => (
                  <div key={detector.id} className="list-group-item">
                    {detector.name}
                  </div>
                ))}
              </div>
            ) : (
              <p>No detectors found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderList;
