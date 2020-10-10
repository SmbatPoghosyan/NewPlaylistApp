import {apiUrl, branchId} from './config';
import axios from 'axios';

export function getPlaylists() {
    return axios.get(apiUrl + '/playlists/' + branchId + '&:withFiles')
}
