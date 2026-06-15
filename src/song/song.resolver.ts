import { Args, Query, Resolver } from "@nestjs/graphql";
import { Song } from "src/graphql";
import { SongService } from "./song.service";
@Resolver()
export class SongResolver {
        constructor(private  songService: SongService) { }
        @Query("songs")
        async getSongs(): Promise<Song[]> {
                return this.songService.getSongs();
        }

        @Query('song')
        async getSong(
                @Args('id')
                id:string
        ): Promise<Song>{
                return this.songService.getSong(id)
        }

}