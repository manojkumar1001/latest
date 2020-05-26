import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


const useStyles = {
    root: {
      height: 240,
      flexGrow: 1,
      maxWidth: 250,
    },
  };


class Sidebar extends Component{

    render(){
        return(
            <TreeView style={useStyles.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
        >
        <TreeItem nodeId="1" label="Create New" >
            <TreeItem nodeId="2" label="FileConfig" />
            <TreeItem nodeId="3" label="Schema" />
            <TreeItem nodeId="4" label="QueryConfig" />
        </TreeItem>
        <TreeItem nodeId="5" label="Retrieve">
            <TreeItem nodeId="10" label="FileConfig" />
            <TreeItem nodeId="6" label="Schema" />
            <TreeItem nodeId="4" label="QueryConfig" />
        </TreeItem>
        </TreeView>
            
        );
    }
    
}

export default Sidebar
