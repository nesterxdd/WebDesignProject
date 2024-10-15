using Microsoft.EntityFrameworkCore;

namespace WebDesignProject.Data
{
    public class ResourceRepository : IResourceRepository
    {
        public async Task<IEnumerable<Resource>> GetAll()
        {
            return new List<Resource>
            {
                new Resource()
                {
                    Title = "Resource1",
                    Type = "Type1",
                    Description = "Description1",
                    Metadata = "Metadata1",
                    Status = "Status1",
                    Reviews = new List<Review>(),
                    ResourceCategories = new List<ResourceCategory>
                    {
                        new ResourceCategory
                        {
                            Category = new Category
                            {
                                Name = "Category1"
                            }
                        }
                    }

                },

                 new Resource()
                {
                    Title = "Resource2",
                    Type = "Type2",
                    Description = "Description2",
                    Metadata = "Metadata2",
                    Status = "Status2",
                    Reviews = new List<Review>(),
                    ResourceCategories = new List<ResourceCategory>
                    {
                        new ResourceCategory
                        {
                            Category = new Category
                            {
                                Name = "Category2"
                            }
                        },
                        new ResourceCategory
                        {
                            Category = new Category
                            {
                                Name = "Category3"
                            }
                        }
                    }

                }
            };
        }

        public async Task<Resource> Get(int id)
        {
            return new Resource()
            {
                Title = "Resource3",
                Type = "Type3",
                Description = "Description3",
                Metadata = "Metadata3",
                Status = "Status3",
                Reviews = new List<Review>(),
                ResourceCategories = new List<ResourceCategory>
                    {
                        new ResourceCategory
                        {
                            Category = new Category
                            {
                                Name = "Category2"
                            }
                        },
                        new ResourceCategory
                        {
                            Category = new Category
                            {
                                Name = "Category3"
                            }
                        }
                    }
            };
        }

        public async Task<Resource> Create(Resource resource)
        {
            return resource;
        }

        public async Task Delete(Resource resource)
        {

        }

        public async Task<Resource> Put(Resource resource)
        {
            return null;
        }
    }
}
