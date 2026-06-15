import { Args, Query, Resolver, Mutation } from "@nestjs/graphql";
import { Song } from "src/graphql";
import { SongService } from "./song.service";
import { CreateSongDTO } from "./dto/create-song-dto";
import { UpdateSongDTO } from "./dto/update-song-dto";
import { UpdateResult, DeleteResult } from "typeorm";
import { GraphQLError } from "graphql/error";
import { PubSub } from "graphql-subscriptions";
import { Subscription } from "@nestjs/graphql";


const pubSub = new PubSub();
@Resolver()
export class SongResolver {
        constructor(private songService: SongService) { }
        @Query("songs")
        async getSongs(): Promise<Song[]> {
                return this.songService.getSongs();
                //throw new Error('Unable to fetch song')
                throw new GraphQLError('Unable to fetch song', {
                        extensions: {
                                code: 'INTERNAL_SERVER_ERROR'
                        }
                })
        }

        @Query('song')
        async getSong(
                @Args('id')
                id: string
        ): Promise<Song> {
                return this.songService.getSong(id)
        }

        @Mutation("createSong")
        async createSong(
                @Args("createSongInput")
                args: CreateSongDTO
        ): Promise<Song> {
                //publish new song
                const newSong = this.songService.createSong(args);
                pubSub.publish("songCreated", { songCreated: newSong });
                return newSong;


                //return this.songService.createSong(args);
        }

        @Mutation("updateSong")
        async updateSong(
                @Args("updateSongInput")
                args: UpdateSongDTO,
                @Args('id')
                id: string
        ): Promise<UpdateResult> {
                return this.songService.updateSong(id, args);
        }

        @Mutation('deleteSong')
        async deleteSong(
                @Args('id')
                id: string,
        ): Promise<DeleteResult> {
                return this.songService.deleteSong(id);
        }

        @Subscription('songCreated')
        songCreated() {
                return pubSub.asyncIterableIterator('songCreated');
        }




}