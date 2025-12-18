package com.zenithlab.data;


import com.zenithlab.models.Profile;

public interface ProfileDao
{
    Profile create(Profile profile);
    Profile getByUserId(int userId);
    void update(Profile profile);
}
