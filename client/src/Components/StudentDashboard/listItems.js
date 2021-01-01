import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <AddBoxIcon />
      </ListItemIcon>
      <ListItemText primary="New Classroom" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Delete Classroom" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <GetAppIcon />
      </ListItemIcon>
      <ListItemText primary="Export Statistics" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AccountBoxIcon />
      </ListItemIcon>
      <ListItemText primary="Manage Profile" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);