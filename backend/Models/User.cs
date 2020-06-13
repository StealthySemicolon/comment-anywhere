using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public byte[] Passhash { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public DateTime Created { get; set; }
    }
}