import React, { useState } from "react";

import MuiTabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import TabPanel from "./TabPanel";

export default function Tabs({ labelList, headerContent, componentList }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <MuiTabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {labelList?.map(({ label, ...props }, index) => (
            <MuiTab
              label={label}
              key={`labelList${index}`}
              iconPosition="start"
              {...props}
              {...a11yProps(index)}
            />
          ))}
        </MuiTabs>

        {headerContent && headerContent}
      </Box>

      {componentList?.map((tab, index) => {
        const { component: Component, props } = tab;
        return (
          <TabPanel
            value={value}
            index={index}
            key={`TabPanelComponent${index}`}
          >
            <Component {...props} />
          </TabPanel>
        );
      })}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
