using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Quizlet_Fake.Lesssion
{
     public class LessionCreateorUpdateDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public Guid CourseId { get;  set; }
    }
}
