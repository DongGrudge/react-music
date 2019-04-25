import React from "react"
import ReactDOM from 'react-dom'

import "./album.styl"

import Header from "@/common/header/Header"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"

import { getAlbumInfo } from "@/api/recommend"
import { CODE_SUCCESS } from "@/api/config"
import * as AlbumModel from "@/model/album"
import * as SongModel from "@/model/song"

import { getSongVKey } from "@/api/song"

import { CSSTransition } from "react-transition-group"

class Album extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            loading: true,
            album: {},
            songs: [],
            refreshScroll: false
        }
    }
    componentDidMount() {

        this.setState({
            show: true
        })

        let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
        let albumContainerDOM = ReactDOM.findDOMNode(this.refs.albumContainer);
        albumContainerDOM.style.top = albumBgDOM.offsetHeight + "px";

        getAlbumInfo(this.props.match.params.id).then((res) => {
            if (res && res.code === CODE_SUCCESS) {

                let album = AlbumModel.createAlbumByDetail(res.data);
                album.desc = res.data.desc;

                let songList = res.data.list;
                let songs = [];

                songList.forEach(item => {
                    let song = SongModel.createSong(item);
                    this.getSongUrl(song, item.songmid);
                    songs.push(song);
                });

                this.setState({
                    loading: false,
                    album: album,
                    songs: songs
                }, () => {
                    //刷新scroll
                    this.setState({ refreshScroll: true });
                });
            }
        });
    }

    getSongUrl(song, mId) {
        getSongVKey(mId).then((res) => {
            if (res) {
                if (res.code === CODE_SUCCESS) {
                    if (res.data.items) {
                        let item = res.data.items[0];
                        song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
                    }
                }
            }
        });
    }


    render() {
        let album = this.state.album;
        let songs = this.state.songs.map((song) => {
            return (
                <div className="song" key={song.id}>
                    <div className="song-name">{song.name}</div>
                    <div className="song-singer">{song.singer}</div>
                </div>
            );
        });
        return (
            <CSSTransition in={this.state.show} timeout={300} classNames="translate">
                <div className="music-album">
                    <Header title={album.name} ref="header"></Header>
                    <div style={{ position: "relative" }}>
                        <div ref="albumBg" className="album-img" style={{ backgroundImage: `url(${album.img})` }}>
                            <div className="filter"></div>
                        </div>
                        <div ref="albumFixedBg" className="album-img fixed" style={{ backgroundImage: `url(${album.img})` }}>
                            <div className="filter"></div>
                        </div>
                        <div className="play-wrapper" ref="playButtonWrapper">
                            <div className="play-button">
                                <i className="icon-play"></i>
                                <span>播放全部</span>
                            </div>
                        </div>
                    </div>
                    <div ref="albumContainer" className="album-container">
                        <div className="album-scroll" style={this.state.loading === true ? { display: "none" } : {}}>
                            <Scroll refresh={this.state.refreshScroll}>
                                <div className="album-wrapper">
                                    <div className="song-count">专辑 共{songs.length}首</div>
                                    <div className="song-list">
                                        {songs}
                                    </div>
                                    <div className="album-info" style={album.desc ? {} : { display: "none" }}>
                                        <h1 className="album-title">专辑简介</h1>
                                        <div className="album-desc">
                                            {album.desc}
                                        </div>
                                    </div>
                                </div>
                            </Scroll>
                        </div>
                        <Loading title="正在加载..." show={this.state.loading} />
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

export default Album
