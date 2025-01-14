import { TypedQuery, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { Authenticated } from 'src/auth/auth.decorator';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ShowService } from './show.service';
import { QueryEpisode, QuerySeason, QueryShow } from './dto/show.queries';
import { TasksService } from 'src/tasks/tasks.service';
import { HasLibraryAccess } from 'src/library/library-access.decorator';
import { ShowWithSeasons } from './dto/show.dto';
import { SeasonWithEpisodes } from './dto/season.dto';
import { Episode } from './dto/episode.dto';

/**
 * Controller for the TV Shows
 */
@ApiTags('show')
@ApiSecurity('bearer')
@Controller('show')
@Authenticated()
export class ShowController {
  constructor(
    public showService: ShowService,
    public tasksService: TasksService,
  ) {}

  /**
   * Get the informations of a show
   */
  @TypedRoute.Get('/')
  @HasLibraryAccess<QueryShow>('READ', {
    from: 'TV_SHOWS',
    id: 'showId',
  })
  public async show(@TypedQuery() query: QueryShow): Promise<ShowWithSeasons> {
    return this.showService.getShow(query.showId);
  }

  /**
   * Start a scan on a show
   */
  @TypedRoute.Post('/scan')
  @HasLibraryAccess<QueryShow>('WRITE', {
    from: 'TV_SHOWS',
    id: 'showId',
  })
  public async scanShow(@TypedQuery() query: QueryShow): Promise<boolean> {
    const show = await this.showService.getShowWithLibrary(query.showId);

    this.tasksService.queueTask({
      name: 'index_show',
      library: {
        id: show.library?.id,
        path: show.library?.path,
      },
      showPath: show.path,
    });
    return true;
  }

  /**
   * Get the informations of a season
   */
  @TypedRoute.Get('season')
  @HasLibraryAccess<QueryShow>('READ', {
    from: 'TV_SHOWS',
    id: 'showId',
  })
  public async season(
    @TypedQuery() query: QuerySeason,
  ): Promise<SeasonWithEpisodes> {
    return this.showService.getSeason(query.seasonId);
  }

  /**
   * Get the informations of a episode
   */
  @TypedRoute.Get('episode')
  @HasLibraryAccess<QueryShow>('READ', {
    from: 'TV_SHOWS',
    id: 'showId',
  })
  public async espisode(@TypedQuery() query: QueryEpisode): Promise<Episode> {
    return this.showService.getEpisode(query.episodeId);
  }
}
