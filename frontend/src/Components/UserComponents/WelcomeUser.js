import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SignUp from './SignUp';
import Login from './Login';


const WelcomeUser = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 2 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    return (
        <div
            className='welcome-div'
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
                height: '100vh',
                backgroundColor: '#191717'
            }}>
            <Box sx={{ width: '30%', boxShadow: 2, height: '90%', background: '#F1EFEF' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    // textColor="#191717"
                    aria-label="secondary tabs example"
                    variant='fullWidth'
                >
                    <Tab
                        value={0}
                        label="Login"
                    />
                    <Tab
                        value={1}
                        label="Sign Up"
                    />
                </Tabs>
                <div style={{ height: '80%' }}>

                    <TabPanel value={value} index={0}>
                        <Login />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <SignUp />
                    </TabPanel>
                </div>
            </Box>
        </div>
    );
}

export default WelcomeUser;