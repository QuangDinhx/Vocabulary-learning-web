using Quizlet_Fake.Courses;
using Quizlet_Fake.Lessons;
using Quizlet_Fake.Managers;
using Quizlet_Fake.Words;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;

namespace Quizlet_Fake.Learns
{
     public class LearnAppService :
        CrudAppService<
            Learn,//Defines CRUD methods
            LearnDto, //Used to show 
            Guid, //Primary key of the  entity
            PagedAndSortedResultRequestDto, //Used for paging/sorting
            LearnCreateUpdateDto>, //Used to create/update 
        ILearnAppService, ITransientDependency
    {
        //public IAbpSession AbpSession { get; set; }
        public LearnAppService(IRepository<Learn, Guid> repository,
            IRepository<CourseInfoOfUser, Guid> _courserepository,
            IRepository<LessonInfoOfUser, Guid> _lessonrepository,
            IRepository<Course, Guid> _course_rea_repository,
            IRepository<Word, Guid> _word_rea_repository,
        IRepository<Lesson, Guid> _lesson_rea_repository,
        ICurrentUser currentUser) : base(repository)
        {
            this._currentUser = currentUser;
            this._repository = repository;
            this._lessonrepository = _lessonrepository;
            this._courserepository = _courserepository;
               this._course_real_repository = _course_rea_repository;
            this._lesson_rea_repository = _lesson_rea_repository;
            this._word_rea_repository = _word_rea_repository;
        }
        private readonly ICurrentUser _currentUser;
        private readonly IRepository<Learn, Guid> _repository;
        private readonly IRepository<LessonInfoOfUser, Guid> _lessonrepository;
        private readonly IRepository<CourseInfoOfUser, Guid> _courserepository;
        private readonly IRepository<Course, Guid> _course_real_repository;
        private readonly IRepository<Lesson, Guid> _lesson_rea_repository;
        private readonly IRepository<Word, Guid> _word_rea_repository;


        public override Task<LearnDto> CreateAsync(LearnCreateUpdateDto input)
            
        {
            input.Level = 0;
            input.DateofLearn = DateTime.Now;
            input.DateReview = DateTime.Now.AddHours(4000);
            
            return base.CreateAsync(input);
        }
        

        public async  Task<LearnDto> UpdateLevelLearningWord( Guid idword, bool b)//dung khi kiem tra review
        {
            var wordinput = _repository.FirstOrDefault(x => x.WordId == idword && x.UserId == _currentUser.Id);
            var lessonlearn = _lessonrepository.FirstOrDefault(x => x.LessonId == wordinput.LessonId && x.UserId == _currentUser.Id);
            int wordnumber = _lesson_rea_repository.FirstOrDefault(x => x.Id == lessonlearn.LessonId ).wordnumber;


            if( wordinput != null)
            {
                LearnCreateUpdateDto input = new LearnCreateUpdateDto();
                //input = ObjectMapper.Map<Learn, LearnCreateUpdateDto>(wordinput);

                input.LessonId = wordinput.LessonId;
                input.Note = wordnumber.ToString();
                input.UserId = wordinput.UserId;
                input.DateofLearn = wordinput.DateofLearn;
                input.DateReview = wordinput.DateReview;
                input.WordId = wordinput.WordId; 

                if( b)
                {
                    if (wordinput.Level < 6)
                    {

                        input.Level = wordinput.Level + 1;
                        input.DateReview = DateTime.Now.AddHours(4 * input.Level);
                        lessonlearn.Progress = (int)((lessonlearn.Progress * 5 * wordnumber + 100) / (5 * wordnumber));
                        await _lessonrepository.UpdateAsync(lessonlearn);
                    }
                }
                else
                {
                    if (wordinput.Level > 1)
                    {
                            
                        input.Level = wordinput.Level - 1;
                        
                         lessonlearn.Progress = (int)((lessonlearn.Progress * 5 * wordnumber - 100)/(5 * wordnumber));
                        await _lessonrepository.UpdateAsync(lessonlearn);

                    }
                    input.DateReview = DateTime.Now.AddHours(4 * input.Level);

                }
                
                return await base.UpdateAsync(wordinput.Id, input);
            }
            else
            {
                return await base.UpdateAsync(new Guid(), new LearnCreateUpdateDto() );
            }
            
        }

        

        public async Task<List<LearnDto>> GetMyWortdList(Guid learnid)
        {
            await CheckGetListPolicyAsync();

            Guid myid = (Guid)_currentUser.Id;
            var query = from word1 in _repository
                        join word in _word_rea_repository on word1.WordId equals word.Id
                        where word.LessonId == learnid && word1.UserId == myid
                        select new { word1, word };

            var queryResult = await AsyncExecuter.ToListAsync(query);

            var DTos = queryResult.Select(x =>
            {
                var dto = ObjectMapper.Map<Learn, LearnDto>(x.word1);
                dto.Vn = x.word.Vn;
                dto.En = x.word.En;
                return dto;
            }).ToList();


            return new List<LearnDto>(DTos);
        }

        public async Task<List<LearnDto>> GetMyReview(Guid idcourse)
        {
            await CheckGetListPolicyAsync();

            Guid myid = (Guid)_currentUser.Id;

            var query = from word1 in _repository
                        join word in _word_rea_repository on word1.WordId equals word.Id
                        join ls in _lesson_rea_repository on word.LessonId equals ls.Id
                        join c in _course_real_repository on ls.CourseId equals c.Id
                        where word1.UserId == myid && c.Id == idcourse
                        orderby word1.Level
                        select new { word1, word };
            query = query.Skip(0).Take(100);
            var queryResult = await AsyncExecuter.ToListAsync(query);

            var DTos = queryResult.Select(x =>
            {
                var dto = ObjectMapper.Map<Learn, LearnDto>(x.word1);
                dto.Vn = x.word.Vn;
                dto.En = x.word.En;
                dto.name = x.word.Name;
                return dto;
            }).ToList();
            List<LearnDto> Llist = new List<LearnDto>(DTos);

            int n = Llist.Count();
            Random rng = new Random();
            while (n > 1)
                
            {
                n--;
                int k = rng.Next(n + 1);
                LearnDto value = Llist[k];
                Llist[k] = Llist[n];
                Llist[n] = value;
            }
            return Llist;
        }


        public async Task<bool> TestResult(TestDto testDto)
        {
            Guid[] wordid =  testDto.words_list;
            bool[] result = testDto.isright;
            var l = new Learn();
            for( int i = 0; i < wordid.Length; i++)
            {
                 await UpdateLevelLearningWord(wordid[i], result[i]);
            }
            
           
            return true;
            
        }
        public void resetprogress(Guid idlesson)
        {
            List<Learn> list = _repository.Where(x => x.LessonId == idlesson && x.UserId == _currentUser.Id).ToList();
            int sum = 0;
            foreach( Learn l in list)
            {
                sum += l.Level;

            }
            int progress =100* sum / (5 * list.Count());

            var oldlessonuser = _lessonrepository.FirstOrDefault(x => x.UserId == _currentUser.Id && x.LessonId == idlesson);
            oldlessonuser.Progress = progress;
            _lessonrepository.UpdateAsync( oldlessonuser) ;
        }

       

    }
}
